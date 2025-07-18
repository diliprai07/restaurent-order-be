import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { UserPayload } from 'src/user/interfaces/user-payload.interface';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    private productService: ProductService,
    private userService: UserService,
  ) {}

  async create(createReviewDto: CreateReviewDto, currentUser: UserPayload) {
    const product = await this.productService.findOne(
      createReviewDto.productId,
    );
    const user = await this.userService.findOne(currentUser.id);

    const reviewFound = await this.reviewRepository.findOne({
      where: { user: { id: currentUser.id }, product: { id: product.id } },
    });

    if (reviewFound)
      throw new BadRequestException('Cannot review the same product');

    const allOrdersDetails = user.orders
      .map((order) => order.orderDetails)
      .flat();
    const productFound = allOrdersDetails.find(
      (orderDetail) => orderDetail.product.id === product.id,
    );

    if (!productFound)
      throw new BadRequestException(`You must buy this product to review`);

    const review = new Review();

    review.content = createReviewDto.content;
    review.rating = createReviewDto.rating;
    review.product = product;
    review.user = user;

    return this.reviewRepository.save(review);
  }

  async findAll() {
    const reviews = await this.reviewRepository.find({
      relations: { user: true, product: true },
    });

    return reviews;
  }

  async findMyReviews(productId: number, currentUser: UserPayload) {
    const reviews = await this.reviewRepository.find({
      where: { user: { id: currentUser.id }, product: { id: productId } },
    });

    return reviews;
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: { user: true, product: true },
    });
    if (!review) throw new NotFoundException(`No review: ${id} found`);

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const { content, rating } = updateReviewDto;

    const review = await this.findOne(id);
    review.content = content ? content : review.content;
    review.rating = rating ? rating : review.rating;

    return this.reviewRepository.save(review);
  }

  async remove(id: number) {
    const review = await this.findOne(id);

    await this.reviewRepository.remove(review);
  }
}

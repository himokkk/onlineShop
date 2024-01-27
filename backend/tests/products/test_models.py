from django.test import TestCase
from django.contrib.auth.models import User
from products.models import Review, Product
from users.models import UserProfile


class ReviewModelTest(TestCase):
    databases = ["default"]

    def setUp(self):
        User.objects.all().delete()
        self.user = User.objects.create_user(username="ReviewModelTest")
        self.product = Product.objects.create(name="Test Product")

    def test_review_creation(self):
        review = Review.objects.create(
            review_type="overall",
            overall_rating=5,
            description="Test review",
            owner=self.user.profile,
            product=self.product,
        )
        self.assertEqual(review.review_type, "overall")
        self.assertEqual(review.overall_rating, 5)
        self.assertEqual(review.description, "Test review")
        self.assertEqual(review.owner, self.user.profile)
        self.assertEqual(review.product, self.product)

    def test_review_str(self):
        review = Review.objects.create(
            review_type="overall",
            overall_rating=5,
            description="Test review",
            owner=self.user.profile,
            product=self.product,
        )
        expected_str = f"Review{review.id} {review.owner.id} {review.product.id}"
        self.assertEqual(str(review), expected_str)

    def test_review_save(self):
        review = Review.objects.create(
            review_type="overall",
            overall_rating=5,
            description="Test review",
            owner=self.user.profile,
            product=self.product,
        )
        review.review_type = "specific"
        review.quality_rating = 4
        review.delivery_rating = 3
        review.communication_rating = 5
        review.save()

        updated_review = Review.objects.get(id=review.id)
        self.assertEqual(updated_review.review_type, "specific")
        self.assertEqual(updated_review.quality_rating, 4)
        self.assertEqual(updated_review.delivery_rating, 3)
        self.assertEqual(updated_review.communication_rating, 5)
        self.assertIsNone(updated_review.overall_rating)
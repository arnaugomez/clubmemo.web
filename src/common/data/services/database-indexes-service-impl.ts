import { usersCollection } from "@/src/auth/data/collections/users-collection";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { courseEnrollmentsCollection } from "@/src/courses/data/collections/course-enrollments-collection";
import { coursePermissionsCollection } from "@/src/courses/data/collections/course-permissions-collection";
import { fileUploadsCollection } from "@/src/file-upload/data/collections/file-uploads-collection";
import { notesCollection } from "@/src/notes/data/collections/notes-collection";
import { practiceCardsCollection } from "@/src/practice/data/collections/practice-cards-collection";
import { reviewLogsCollection } from "@/src/practice/data/collections/review-logs-collection";
import { profilesCollection } from "@/src/profile/data/collections/profiles-collection";
import { rateLimitsCollection } from "@/src/rate-limits/data/collections/rate-limits-collection";
import { tagsCollection } from "@/src/tags/data/collections/tags-collection";
import type { DatabaseIndexesService } from "../../domain/interfaces/database-indexes-service";

/**
 * Implementation of `DatabaseIndexesService` using the MongoDB database.
 */
export class DatabaseIndexesServiceImpl implements DatabaseIndexesService {
  private readonly profilesCollection: typeof profilesCollection.type;
  private readonly usersCollection: typeof usersCollection.type;
  private readonly coursePermissions: typeof coursePermissionsCollection.type;
  private readonly courseEnrollments: typeof courseEnrollmentsCollection.type;
  private readonly practiceCards: typeof practiceCardsCollection.type;
  private readonly notes: typeof notesCollection.type;
  private readonly reviewLogs: typeof reviewLogsCollection.type;
  private readonly rateLimits: typeof rateLimitsCollection.type;
  private readonly tags: typeof tagsCollection.type;
  private readonly fileUploads: typeof fileUploadsCollection.type;

  constructor(databaseService: DatabaseService) {
    this.profilesCollection = databaseService.collection(profilesCollection);
    this.usersCollection = databaseService.collection(usersCollection);
    this.coursePermissions = databaseService.collection(
      coursePermissionsCollection,
    );
    this.courseEnrollments = databaseService.collection(
      courseEnrollmentsCollection,
    );
    this.practiceCards = databaseService.collection(practiceCardsCollection);
    this.notes = databaseService.collection(notesCollection);
    this.reviewLogs = databaseService.collection(reviewLogsCollection);
    this.rateLimits = databaseService.collection(rateLimitsCollection);
    this.tags = databaseService.collection(tagsCollection);
    this.fileUploads = databaseService.collection(fileUploadsCollection);
  }

  async createIndexes() {
    await Promise.all([
      this.usersCollection.createIndex({ email: 1 }, { unique: true }),
      this.profilesCollection.createIndex({ userId: 1 }),
      this.profilesCollection.createIndex({ handle: 1 }),
      this.coursePermissions.createIndex({ courseId: 1, profileId: 1 }),
      this.courseEnrollments.createIndex({ courseId: 1, profileId: 1 }),
      this.courseEnrollments.createIndex({ profileId: 1 }),
      this.courseEnrollments.createIndex({ profileId: 1, isFavorite: 1 }),
      this.practiceCards.createIndex({ courseEnrollmentId: 1, due: 1 }),
      this.notes.createIndex({ courseId: 1 }),
      this.reviewLogs.createIndex({
        courseEnrollmentId: 1,
        review: 1,
        state: 1,
      }),
      this.rateLimits.createIndex({ name: 1 }),
      this.rateLimits.createIndex({ name: 1, updatedAt: 1 }),
      this.tags.createIndex({ name: 1 }, { unique: true }),
      this.fileUploads.createIndex({ keyPrefix: 1 }),
      this.fileUploads.createIndex({ key: 1 }),
    ]);
  }
}

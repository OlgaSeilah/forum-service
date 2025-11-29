import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock the postService module before importing
jest.unstable_mockModule('../services/post.service.js', () => ({
    default: {
        createPost: jest.fn(),
        getPostById: jest.fn(),
        addLikeToPost: jest.fn(),
        getPostsByAuthor: jest.fn(),
        addComment: jest.fn(),
        getPostsByTags: jest.fn(),
        getPostsByPeriod: jest.fn(),
        updatePost: jest.fn(),
        deletePostById: jest.fn()
    }
}));

const postService = (await import('../services/post.service.js')).default;
const postController = (await import('../controller/post.controller.js')).default;

describe('PostController', () => {
    let req, res, next;

    beforeEach(() => {
        // Create fresh mock objects before each test
        req = {
            params: {},
            body: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            end: jest.fn().mockReturnThis()
        };
        next = jest.fn();

        // Clear all mock calls and instances
        jest.clearAllMocks();
    });

    describe('createPost', () => {
        it('should create a post successfully and return 201 status', async () => {
            // Arrange
            const mockAuthor = 'testAuthor';
            const mockPostData = { title: 'Test Post', content: 'Test Content' };
            const mockCreatedPost = { id: '1', author: mockAuthor, ...mockPostData };
            
            req.params.author = mockAuthor;
            req.body = mockPostData;
            postService.createPost.mockResolvedValue(mockCreatedPost);

            // Act
            await postController.createPost(req, res, next);

            // Assert
            expect(postService.createPost).toHaveBeenCalledWith(mockAuthor, mockPostData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCreatedPost);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when createPost fails', async () => {
            // Arrange
            const mockError = new Error('Failed to create post');
            req.params.author = 'testAuthor';
            req.body = { title: 'Test Post' };
            postService.createPost.mockRejectedValue(mockError);

            // Act
            await postController.createPost(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('getPostById', () => {
        it('should get a post by id successfully', async () => {
            // Arrange
            const mockPostId = '123';
            const mockPost = { id: mockPostId, title: 'Test Post', content: 'Test Content' };
            
            req.params.id = mockPostId;
            postService.getPostById.mockResolvedValue(mockPost);

            // Act
            await postController.getPostById(req, res, next);

            // Assert
            expect(postService.getPostById).toHaveBeenCalledWith(mockPostId);
            expect(res.json).toHaveBeenCalledWith(mockPost);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when getPostById fails', async () => {
            // Arrange
            const mockError = new Error('Post not found');
            req.params.id = '123';
            postService.getPostById.mockRejectedValue(mockError);

            // Act
            await postController.getPostById(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('addLikeToPost', () => {
        it('should add a like to post and return 204 status', async () => {
            // Arrange
            const mockPostId = '123';
            req.params.id = mockPostId;
            postService.addLikeToPost.mockResolvedValue();

            // Act
            await postController.addLikeToPost(req, res, next);

            // Assert
            expect(postService.addLikeToPost).toHaveBeenCalledWith(mockPostId);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when addLikeToPost fails', async () => {
            // Arrange
            const mockError = new Error('Failed to add like');
            req.params.id = '123';
            postService.addLikeToPost.mockRejectedValue(mockError);

            // Act
            await postController.addLikeToPost(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('getPostsByAuthor', () => {
        it('should get posts by author successfully', async () => {
            // Arrange
            const mockAuthor = 'testAuthor';
            const mockPosts = [
                { id: '1', author: mockAuthor, title: 'Post 1' },
                { id: '2', author: mockAuthor, title: 'Post 2' }
            ];
            
            req.params.author = mockAuthor;
            postService.getPostsByAuthor.mockResolvedValue(mockPosts);

            // Act
            await postController.getPostsByAuthor(req, res, next);

            // Assert
            expect(postService.getPostsByAuthor).toHaveBeenCalledWith(mockAuthor);
            expect(res.json).toHaveBeenCalledWith(mockPosts);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when getPostsByAuthor fails', async () => {
            // Arrange
            const mockError = new Error('Failed to get posts by author');
            req.params.author = 'testAuthor';
            postService.getPostsByAuthor.mockRejectedValue(mockError);

            // Act
            await postController.getPostsByAuthor(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('addComment', () => {
        it('should add a comment to post successfully', async () => {
            // Arrange
            const mockPostId = '123';
            const mockCommenter = 'testCommenter';
            const mockMessage = 'This is a test comment';
            const mockPostWithComment = { 
                id: mockPostId, 
                comments: [{ commenter: mockCommenter, message: mockMessage }]
            };
            
            req.params.id = mockPostId;
            req.params.commenter = mockCommenter;
            req.body.message = mockMessage;
            postService.addComment.mockResolvedValue(mockPostWithComment);

            // Act
            await postController.addComment(req, res, next);

            // Assert
            expect(postService.addComment).toHaveBeenCalledWith(mockPostId, mockCommenter, mockMessage);
            expect(res.json).toHaveBeenCalledWith(mockPostWithComment);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when addComment fails', async () => {
            // Arrange
            const mockError = new Error('Failed to add comment');
            req.params.id = '123';
            req.params.commenter = 'testCommenter';
            req.body.message = 'Test message';
            postService.addComment.mockRejectedValue(mockError);

            // Act
            await postController.addComment(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('getPostsByTags', () => {
        it('should get posts by tags successfully and convert to lowercase', async () => {
            // Arrange
            const mockTags = 'JavaScript,Node';
            const mockPosts = [
                { id: '1', title: 'Post 1', tags: ['javascript', 'node'] },
                { id: '2', title: 'Post 2', tags: ['javascript'] }
            ];
            
            req.query.values = mockTags;
            postService.getPostsByTags.mockResolvedValue(mockPosts);

            // Act
            await postController.getPostsByTags(req, res, next);

            // Assert
            expect(postService.getPostsByTags).toHaveBeenCalledWith(mockTags.toLowerCase());
            expect(res.json).toHaveBeenCalledWith(mockPosts);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when getPostsByTags fails', async () => {
            // Arrange
            const mockError = new Error('Failed to get posts by tags');
            req.query.values = 'javascript';
            postService.getPostsByTags.mockRejectedValue(mockError);

            // Act
            await postController.getPostsByTags(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('getPostsByPeriod', () => {
        it('should get posts by period successfully', async () => {
            // Arrange
            const mockDateFrom = '2025-01-01';
            const mockDateTo = '2025-12-31';
            const mockPosts = [
                { id: '1', title: 'Post 1', createdAt: '2025-06-15' },
                { id: '2', title: 'Post 2', createdAt: '2025-07-20' }
            ];
            
            req.query.dateFrom = mockDateFrom;
            req.query.dateTo = mockDateTo;
            postService.getPostsByPeriod.mockResolvedValue(mockPosts);

            // Act
            await postController.getPostsByPeriod(req, res, next);

            // Assert
            expect(postService.getPostsByPeriod).toHaveBeenCalledWith(mockDateFrom, mockDateTo);
            expect(res.json).toHaveBeenCalledWith(mockPosts);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when getPostsByPeriod fails', async () => {
            // Arrange
            const mockError = new Error('Failed to get posts by period');
            req.query.dateFrom = '2025-01-01';
            req.query.dateTo = '2025-12-31';
            postService.getPostsByPeriod.mockRejectedValue(mockError);

            // Act
            await postController.getPostsByPeriod(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('updatePost', () => {
        it('should update a post successfully', async () => {
            // Arrange
            const mockPostId = '123';
            const mockUpdateData = { title: 'Updated Title', content: 'Updated Content' };
            const mockUpdatedPost = { id: mockPostId, ...mockUpdateData };
            
            req.params.id = mockPostId;
            req.body = mockUpdateData;
            postService.updatePost.mockResolvedValue(mockUpdatedPost);

            // Act
            await postController.updatePost(req, res, next);

            // Assert
            expect(postService.updatePost).toHaveBeenCalledWith(mockPostId, mockUpdateData);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedPost);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when updatePost fails', async () => {
            // Arrange
            const mockError = new Error('Failed to update post');
            req.params.id = '123';
            req.body = { title: 'Updated Title' };
            postService.updatePost.mockRejectedValue(mockError);

            // Act
            await postController.updatePost(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('deletePostById', () => {
        it('should delete a post by id successfully', async () => {
            // Arrange
            const mockPostId = '123';
            const mockDeletedPost = { id: mockPostId, title: 'Deleted Post' };
            
            req.params.id = mockPostId;
            postService.deletePostById.mockResolvedValue(mockDeletedPost);

            // Act
            await postController.deletePostById(req, res, next);

            // Assert
            expect(postService.deletePostById).toHaveBeenCalledWith(mockPostId);
            expect(res.json).toHaveBeenCalledWith(mockDeletedPost);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when deletePostById fails', async () => {
            // Arrange
            const mockError = new Error('Failed to delete post');
            req.params.id = '123';
            postService.deletePostById.mockRejectedValue(mockError);

            // Act
            await postController.deletePostById(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});

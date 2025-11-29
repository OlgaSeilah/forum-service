import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock the postRepository module before importing
jest.unstable_mockModule('../repository/post.repository.js', () => ({
    default: {
        createPost: jest.fn(),
        findPostById: jest.fn(),
        addLikeToPostByPostId: jest.fn(),
        findPostsByAuthor: jest.fn(),
        addComment: jest.fn(),
        deletePost: jest.fn(),
        getPostsByTags: jest.fn(),
        getPostsByPeriod: jest.fn(),
        updatePost: jest.fn()
    }
}));

const postRepository = (await import('../repository/post.repository.js')).default;
const postService = (await import('../services/post.service.js')).default;

describe('PostService', () => {
    beforeEach(() => {
        // Clear all mock calls and instances before each test
        jest.clearAllMocks();
    });

    describe('createPost', () => {
        it('should create a post successfully', async () => {
            // Arrange
            const mockAuthor = 'testAuthor';
            const mockData = { title: 'Test Post', content: 'Test Content', tags: ['test'] };
            const mockCreatedPost = { id: '1', author: mockAuthor, ...mockData };
            
            postRepository.createPost.mockResolvedValue(mockCreatedPost);

            // Act
            const result = await postService.createPost(mockAuthor, mockData);

            // Assert
            expect(postRepository.createPost).toHaveBeenCalledWith({ ...mockData, author: mockAuthor });
            expect(result).toEqual(mockCreatedPost);
        });

        it('should merge author with data correctly', async () => {
            // Arrange
            const mockAuthor = 'anotherAuthor';
            const mockData = { title: 'Another Post', content: 'Content' };
            const mockCreatedPost = { id: '2', author: mockAuthor, ...mockData };
            
            postRepository.createPost.mockResolvedValue(mockCreatedPost);

            // Act
            await postService.createPost(mockAuthor, mockData);

            // Assert
            expect(postRepository.createPost).toHaveBeenCalledWith(expect.objectContaining({
                author: mockAuthor,
                title: 'Another Post',
                content: 'Content'
            }));
        });
    });

    describe('getPostById', () => {
        it('should return post when found', async () => {
            // Arrange
            const mockPostId = '123';
            const mockPost = { id: mockPostId, title: 'Test Post', content: 'Test Content' };
            
            postRepository.findPostById.mockResolvedValue(mockPost);

            // Act
            const result = await postService.getPostById(mockPostId);

            // Assert
            expect(postRepository.findPostById).toHaveBeenCalledWith(mockPostId);
            expect(result).toEqual(mockPost);
        });

        it('should throw error when post not found', async () => {
            // Arrange
            const mockPostId = '999';
            postRepository.findPostById.mockResolvedValue(null);

            // Act & Assert
            await expect(postService.getPostById(mockPostId))
                .rejects
                .toThrow(`Post with id ${mockPostId} not found`);
            expect(postRepository.findPostById).toHaveBeenCalledWith(mockPostId);
        });

        it('should throw error when post is undefined', async () => {
            // Arrange
            const mockPostId = '888';
            postRepository.findPostById.mockResolvedValue(undefined);

            // Act & Assert
            await expect(postService.getPostById(mockPostId))
                .rejects
                .toThrow(`Post with id ${mockPostId} not found`);
        });
    });

    describe('addLikeToPost', () => {
        it('should add like to post successfully', async () => {
            // Arrange
            const mockPostId = '123';
            const mockSuccess = { id: mockPostId, likes: 1 };
            
            postRepository.addLikeToPostByPostId.mockResolvedValue(mockSuccess);

            // Act
            const result = await postService.addLikeToPost(mockPostId);

            // Assert
            expect(postRepository.addLikeToPostByPostId).toHaveBeenCalledWith(mockPostId);
            expect(result).toEqual(mockSuccess);
        });

        it('should throw error when post not found', async () => {
            // Arrange
            const mockPostId = '999';
            postRepository.addLikeToPostByPostId.mockResolvedValue(null);

            // Act & Assert
            await expect(postService.addLikeToPost(mockPostId))
                .rejects
                .toThrow(`Post with id ${mockPostId} not found`);
            expect(postRepository.addLikeToPostByPostId).toHaveBeenCalledWith(mockPostId);
        });

        it('should throw error when repository returns false', async () => {
            // Arrange
            const mockPostId = '888';
            postRepository.addLikeToPostByPostId.mockResolvedValue(false);

            // Act & Assert
            await expect(postService.addLikeToPost(mockPostId))
                .rejects
                .toThrow(`Post with id ${mockPostId} not found`);
        });
    });

    describe('getPostsByAuthor', () => {
        it('should return posts for author', async () => {
            // Arrange
            const mockAuthor = 'testAuthor';
            const mockPosts = [
                { id: '1', author: mockAuthor, title: 'Post 1' },
                { id: '2', author: mockAuthor, title: 'Post 2' }
            ];
            
            postRepository.findPostsByAuthor.mockResolvedValue(mockPosts);

            // Act
            const result = await postService.getPostsByAuthor(mockAuthor);

            // Assert
            expect(postRepository.findPostsByAuthor).toHaveBeenCalledWith(mockAuthor);
            expect(result).toEqual(mockPosts);
        });

        it('should throw error when no posts found for author', async () => {
            // Arrange
            const mockAuthor = 'unknownAuthor';
            postRepository.findPostsByAuthor.mockResolvedValue(null);

            // Act & Assert
            await expect(postService.getPostsByAuthor(mockAuthor))
                .rejects
                .toThrow(`Posts for user ${mockAuthor} not found`);
            expect(postRepository.findPostsByAuthor).toHaveBeenCalledWith(mockAuthor);
        });

        it('should throw error when posts is undefined', async () => {
            // Arrange
            const mockAuthor = 'anotherAuthor';
            postRepository.findPostsByAuthor.mockResolvedValue(undefined);

            // Act & Assert
            await expect(postService.getPostsByAuthor(mockAuthor))
                .rejects
                .toThrow(`Posts for user ${mockAuthor} not found`);
        });
    });

    describe('addComment', () => {
        it('should add comment to post successfully', async () => {
            // Arrange
            const mockPostId = '123';
            const mockCommenter = 'commenter1';
            const mockComment = 'This is a test comment';
            const mockUpdatedPost = { 
                id: mockPostId, 
                comments: [{ commenter: mockCommenter, comment: mockComment }] 
            };
            
            postRepository.addComment.mockResolvedValue(mockUpdatedPost);

            // Act
            const result = await postService.addComment(mockPostId, mockCommenter, mockComment);

            // Assert
            expect(postRepository.addComment).toHaveBeenCalledWith(mockPostId, mockCommenter, mockComment);
            expect(result).toEqual(mockUpdatedPost);
        });

        it('should throw error when post not found', async () => {
            // Arrange
            const mockPostId = '999';
            const mockCommenter = 'commenter1';
            const mockComment = 'Comment';
            postRepository.addComment.mockResolvedValue(null);

            // Act & Assert
            await expect(postService.addComment(mockPostId, mockCommenter, mockComment))
                .rejects
                .toThrow(`Post with id ${mockPostId} not found`);
            expect(postRepository.addComment).toHaveBeenCalledWith(mockPostId, mockCommenter, mockComment);
        });

        it('should throw error when addComment returns undefined', async () => {
            // Arrange
            const mockPostId = '888';
            const mockCommenter = 'commenter2';
            const mockComment = 'Another comment';
            postRepository.addComment.mockResolvedValue(undefined);

            // Act & Assert
            await expect(postService.addComment(mockPostId, mockCommenter, mockComment))
                .rejects
                .toThrow(`Post with id ${mockPostId} not found`);
        });
    });

    describe('deletePostById', () => {
        it('should delete post successfully', async () => {
            // Arrange
            const mockPostId = '123';
            const mockDeletedPost = { id: mockPostId, deleted: true };
            
            postRepository.deletePost.mockResolvedValue(mockDeletedPost);

            // Act
            const result = await postService.deletePostById(mockPostId);

            // Assert
            expect(postRepository.deletePost).toHaveBeenCalledWith(mockPostId);
            expect(result).toEqual(mockDeletedPost);
        });

        it('should throw error when post not found', async () => {
            // Arrange
            const mockPostId = '999';
            postRepository.deletePost.mockResolvedValue(null);

            // Act & Assert
            await expect(postService.deletePostById(mockPostId))
                .rejects
                .toThrow(`Post with id ${mockPostId} not found`);
            expect(postRepository.deletePost).toHaveBeenCalledWith(mockPostId);
        });

        it('should throw error when deletePost returns undefined', async () => {
            // Arrange
            const mockPostId = '888';
            postRepository.deletePost.mockResolvedValue(undefined);

            // Act & Assert
            await expect(postService.deletePostById(mockPostId))
                .rejects
                .toThrow(`Post with id ${mockPostId} not found`);
        });
    });

    describe('getPostsByTags', () => {
        it('should split tags and return posts', async () => {
            // Arrange
            const mockTagsString = 'tag1,tag2,tag3';
            const mockPosts = [
                { id: '1', tags: ['tag1', 'tag2'] },
                { id: '2', tags: ['tag2', 'tag3'] }
            ];
            
            postRepository.getPostsByTags.mockResolvedValue(mockPosts);

            // Act
            const result = await postService.getPostsByTags(mockTagsString);

            // Assert
            expect(postRepository.getPostsByTags).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
            expect(result).toEqual(mockPosts);
        });

        it('should handle single tag', async () => {
            // Arrange
            const mockTagsString = 'singleTag';
            const mockPosts = [{ id: '1', tags: ['singleTag'] }];
            
            postRepository.getPostsByTags.mockResolvedValue(mockPosts);

            // Act
            const result = await postService.getPostsByTags(mockTagsString);

            // Assert
            expect(postRepository.getPostsByTags).toHaveBeenCalledWith(['singleTag']);
            expect(result).toEqual(mockPosts);
        });

        it('should throw error when no posts found for tags', async () => {
            // Arrange
            const mockTagsString = 'unknownTag1,unknownTag2';
            postRepository.getPostsByTags.mockResolvedValue(null);

            // Act & Assert
            await expect(postService.getPostsByTags(mockTagsString))
                .rejects
                .toThrow(`Posts for tags unknownTag1,unknownTag2 not found`);
            expect(postRepository.getPostsByTags).toHaveBeenCalledWith(['unknownTag1', 'unknownTag2']);
        });

        it('should throw error when posts is undefined', async () => {
            // Arrange
            const mockTagsString = 'tag1,tag2';
            postRepository.getPostsByTags.mockResolvedValue(undefined);

            // Act & Assert
            await expect(postService.getPostsByTags(mockTagsString))
                .rejects
                .toThrow(`Posts for tags tag1,tag2 not found`);
        });
    });

    describe('getPostsByPeriod', () => {
        it('should return posts within date period', async () => {
            // Arrange
            const mockDateFrom = '2025-01-01';
            const mockDateTo = '2025-01-31';
            const mockPosts = [
                { id: '1', createdAt: '2025-01-15' },
                { id: '2', createdAt: '2025-01-20' }
            ];
            
            postRepository.getPostsByPeriod.mockResolvedValue(mockPosts);

            // Act
            const result = await postService.getPostsByPeriod(mockDateFrom, mockDateTo);

            // Assert
            expect(postRepository.getPostsByPeriod).toHaveBeenCalledWith(mockDateFrom, mockDateTo);
            expect(result).toEqual(mockPosts);
        });

        it('should throw error when no posts found for period', async () => {
            // Arrange
            const mockDateFrom = '2025-12-01';
            const mockDateTo = '2025-12-31';
            postRepository.getPostsByPeriod.mockResolvedValue(null);

            // Act & Assert
            await expect(postService.getPostsByPeriod(mockDateFrom, mockDateTo))
                .rejects
                .toThrow(`Posts for period ${mockDateFrom} - ${mockDateTo} not found`);
            expect(postRepository.getPostsByPeriod).toHaveBeenCalledWith(mockDateFrom, mockDateTo);
        });

        it('should throw error when posts is undefined', async () => {
            // Arrange
            const mockDateFrom = '2025-06-01';
            const mockDateTo = '2025-06-30';
            postRepository.getPostsByPeriod.mockResolvedValue(undefined);

            // Act & Assert
            await expect(postService.getPostsByPeriod(mockDateFrom, mockDateTo))
                .rejects
                .toThrow(`Posts for period ${mockDateFrom} - ${mockDateTo} not found`);
        });
    });

    describe('updatePost', () => {
        it('should update post successfully', async () => {
            // Arrange
            const mockPostId = '123';
            const mockData = { title: 'Updated Title', content: 'Updated Content' };
            const mockUpdatedPost = { id: mockPostId, ...mockData };
            
            postRepository.updatePost.mockResolvedValue(mockUpdatedPost);

            // Act
            const result = await postService.updatePost(mockPostId, mockData);

            // Assert
            expect(postRepository.updatePost).toHaveBeenCalledWith(mockPostId, mockData);
            expect(result).toEqual(mockUpdatedPost);
        });

        it('should throw error when post not found', async () => {
            // Arrange
            const mockPostId = '999';
            const mockData = { title: 'Updated Title' };
            postRepository.updatePost.mockResolvedValue(null);

            // Act & Assert
            await expect(postService.updatePost(mockPostId, mockData))
                .rejects
                .toThrow(`Post with id ${mockPostId} not found`);
            expect(postRepository.updatePost).toHaveBeenCalledWith(mockPostId, mockData);
        });

        it('should throw error when updatePost returns undefined', async () => {
            // Arrange
            const mockPostId = '888';
            const mockData = { content: 'New content' };
            postRepository.updatePost.mockResolvedValue(undefined);

            // Act & Assert
            await expect(postService.updatePost(mockPostId, mockData))
                .rejects
                .toThrow(`Post with id ${mockPostId} not found`);
        });

        it('should update post with partial data', async () => {
            // Arrange
            const mockPostId = '456';
            const mockData = { title: 'Only Title Update' };
            const mockUpdatedPost = { id: mockPostId, title: 'Only Title Update', content: 'Old Content' };
            
            postRepository.updatePost.mockResolvedValue(mockUpdatedPost);

            // Act
            const result = await postService.updatePost(mockPostId, mockData);

            // Assert
            expect(postRepository.updatePost).toHaveBeenCalledWith(mockPostId, mockData);
            expect(result).toEqual(mockUpdatedPost);
        });
    });
});

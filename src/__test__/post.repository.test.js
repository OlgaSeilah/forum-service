import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock the Post model before importing
jest.unstable_mockModule('../model/posts/post.model.js', () => {
    const mockSave = jest.fn();
    const mockFindById = jest.fn();
    const mockFindByIdAndUpdate = jest.fn();
    const mockFind = jest.fn();
    const mockFindByIdAndDelete = jest.fn();

    const MockPost = jest.fn().mockImplementation(() => ({
        save: mockSave
    }));

    MockPost.findById = mockFindById;
    MockPost.findByIdAndUpdate = mockFindByIdAndUpdate;
    MockPost.find = mockFind;
    MockPost.findByIdAndDelete = mockFindByIdAndDelete;

    return {
        default: MockPost
    };
});

const Post = (await import('../model/posts/post.model.js')).default;
const postRepository = (await import('../repository/post.repository.js')).default;

describe('PostRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createPost', () => {
        it('should create and save a new post', async () => {
            const postData = {
                title: 'Test Post',
                content: 'Test Content',
                author: 'Test Author'
            };

            const mockSavedPost = {
                _id: '123',
                ...postData,
                dateCreated: new Date(),
                tags: [],
                likes: 0,
                comments: []
            };

            Post.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(mockSavedPost)
            }));

            const result = await postRepository.createPost(postData);

            expect(Post).toHaveBeenCalledWith(postData);
            expect(result).toBeDefined();
            expect(result).toEqual(mockSavedPost);
        });
    });

    describe('findPostById', () => {
        it('should find a post by id', async () => {
            const postId = '123';
            const mockPost = {
                _id: postId,
                title: 'Test Post',
                content: 'Test Content',
                author: 'Test Author'
            };

            Post.findById.mockResolvedValue(mockPost);

            const result = await postRepository.findPostById(postId);

            expect(Post.findById).toHaveBeenCalledWith(postId);
            expect(result).toEqual(mockPost);
        });

        it('should return null when post is not found', async () => {
            const postId = 'nonexistent';

            Post.findById.mockResolvedValue(null);

            const result = await postRepository.findPostById(postId);

            expect(Post.findById).toHaveBeenCalledWith(postId);
            expect(result).toBeNull();
        });
    });

    describe('addLikeToPostByPostId', () => {
        it('should increment likes for a post', async () => {
            const postId = '123';
            const mockUpdatedPost = {
                _id: postId,
                title: 'Test Post',
                likes: 1
            };

            Post.findByIdAndUpdate.mockResolvedValue(mockUpdatedPost);

            const result = await postRepository.addLikeToPostByPostId(postId);

            expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
                postId,
                { $inc: { likes: 1 } },
                {},
                {}
            );
            expect(result).toEqual(mockUpdatedPost);
        });
    });

    describe('findPostsByAuthor', () => {
        it('should find all posts by author name', async () => {
            const authorName = 'Test Author';
            const mockPosts = [
                { _id: '1', title: 'Post 1', author: authorName },
                { _id: '2', title: 'Post 2', author: authorName }
            ];

            Post.find.mockResolvedValue(mockPosts);

            const result = await postRepository.findPostsByAuthor(authorName);

            expect(Post.find).toHaveBeenCalledWith({ author: authorName });
            expect(result).toEqual(mockPosts);
        });

        it('should return empty array when no posts found for author', async () => {
            const authorName = 'Unknown Author';

            Post.find.mockResolvedValue([]);

            const result = await postRepository.findPostsByAuthor(authorName);

            expect(Post.find).toHaveBeenCalledWith({ author: authorName });
            expect(result).toEqual([]);
        });
    });

    describe('addComment', () => {
        it('should add a comment to a post', async () => {
            const postId = '123';
            const commenter = 'John Doe';
            const comment = 'Great post!';
            const mockUpdatedPost = {
                _id: postId,
                title: 'Test Post',
                comments: [
                    { user: commenter, message: comment }
                ]
            };

            Post.findByIdAndUpdate.mockResolvedValue(mockUpdatedPost);

            const result = await postRepository.addComment(postId, commenter, comment);

            expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
                postId,
                {
                    $push: {
                        comments: {
                            user: commenter,
                            message: comment
                        }
                    }
                },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedPost);
        });
    });

    describe('getPostsByTags', () => {
        it('should find posts by tags', async () => {
            const tags = ['javascript', 'nodejs'];
            const mockPosts = [
                { _id: '1', title: 'Post 1', tags: ['javascript'] },
                { _id: '2', title: 'Post 2', tags: ['nodejs'] }
            ];

            Post.find.mockResolvedValue(mockPosts);

            const result = await postRepository.getPostsByTags(tags);

            expect(Post.find).toHaveBeenCalledWith({
                $or: [
                    { tags: /^javascript$/i },
                    { tags: /^nodejs$/i }
                ]
            });
            expect(result).toEqual(mockPosts);
        });

        it('should return empty array when no posts match tags', async () => {
            const tags = ['unknown'];

            Post.find.mockResolvedValue([]);

            const result = await postRepository.getPostsByTags(tags);

            expect(Post.find).toHaveBeenCalledWith({
                $or: [
                    { tags: /^unknown$/i }
                ]
            });
            expect(result).toEqual([]);
        });
    });

    describe('updatePost', () => {
        it('should update a post', async () => {
            const postId = '123';
            const updateData = {
                title: 'Updated Title',
                content: 'Updated Content'
            };
            const mockUpdatedPost = {
                _id: postId,
                ...updateData
            };

            Post.findByIdAndUpdate.mockResolvedValue(mockUpdatedPost);

            const result = await postRepository.updatePost(postId, updateData);

            expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
                postId,
                {
                    $set: {
                        title: 'Updated Title',
                        content: 'Updated Content'
                    }
                },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedPost);
        });

        it('should return null when post to update is not found', async () => {
            const postId = 'nonexistent';
            const updateData = { title: 'New Title' };

            Post.findByIdAndUpdate.mockResolvedValue(null);

            const result = await postRepository.updatePost(postId, updateData);

            expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
                postId,
                {
                    $set: {
                        title: 'New Title',
                        content: undefined
                    }
                },
                { new: true }
            );
            expect(result).toBeNull();
        });
    });

    describe('getPostsByPeriod', () => {
        it('should find posts within a date range', async () => {
            const dateFrom = new Date('2024-01-01');
            const dateTo = new Date('2024-12-31');
            const mockPosts = [
                { _id: '1', title: 'Post 1', dateCreated: new Date('2024-06-15') },
                { _id: '2', title: 'Post 2', dateCreated: new Date('2024-08-20') }
            ];

            Post.find.mockResolvedValue(mockPosts);

            const result = await postRepository.getPostsByPeriod(dateFrom, dateTo);

            expect(Post.find).toHaveBeenCalledWith({
                dateCreated: {
                    $gte: dateFrom,
                    $lte: dateTo
                }
            });
            expect(result).toEqual(mockPosts);
        });

        it('should return empty array when no posts in date range', async () => {
            const dateFrom = new Date('2025-01-01');
            const dateTo = new Date('2025-12-31');

            Post.find.mockResolvedValue([]);

            const result = await postRepository.getPostsByPeriod(dateFrom, dateTo);

            expect(Post.find).toHaveBeenCalledWith({
                dateCreated: {
                    $gte: dateFrom,
                    $lte: dateTo
                }
            });
            expect(result).toEqual([]);
        });
    });

    describe('deletePost', () => {
        it('should delete a post by id', async () => {
            const postId = '123';
            const mockDeletedPost = {
                _id: postId,
                title: 'Deleted Post',
                content: 'This will be deleted'
            };

            Post.findByIdAndDelete.mockResolvedValue(mockDeletedPost);

            const result = await postRepository.deletePost(postId);

            expect(Post.findByIdAndDelete).toHaveBeenCalledWith(postId);
            expect(result).toEqual(mockDeletedPost);
        });

        it('should return null when post to delete is not found', async () => {
            const postId = 'nonexistent';

            Post.findByIdAndDelete.mockResolvedValue(null);

            const result = await postRepository.deletePost(postId);

            expect(Post.findByIdAndDelete).toHaveBeenCalledWith(postId);
            expect(result).toBeNull();
        });
    });
});

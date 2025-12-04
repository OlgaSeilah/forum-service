import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock the userAccountService module before importing
jest.unstable_mockModule('../services/userAccount.service.js', () => ({
    default: {
        register: jest.fn(),
        getUser: jest.fn(),
        updateUser: jest.fn(),
        changeRoles: jest.fn(),
        removeUser: jest.fn(),
        changePassword: jest.fn()
    }
}));

const userAccountService = (await import('../services/userAccount.service.js')).default;
const userAccountController = (await import('../controller/userAccount.controller.js')).default;

describe('UserAccountController', () => {
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

    describe('register', () => {
        it('should register a new user successfully and return 201 status', async () => {
            // Arrange
            const mockUserData = { 
                login: 'testUser', 
                email: 'test@example.com', 
                password: 'password123' 
            };
            const mockNewUser = { 
                id: '1', 
                login: 'testUser', 
                email: 'test@example.com' 
            };
            
            req.body = mockUserData;
            userAccountService.register.mockResolvedValue(mockNewUser);

            // Act
            await userAccountController.register(req, res, next);

            // Assert
            expect(userAccountService.register).toHaveBeenCalledWith(mockUserData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockNewUser);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when register fails', async () => {
            // Arrange
            const mockError = new Error('User already exists');
            req.body = { login: 'testUser', email: 'test@example.com' };
            userAccountService.register.mockRejectedValue(mockError);

            // Act
            await userAccountController.register(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('getUser', () => {
        it('should get a user by login successfully', async () => {
            // Arrange
            const mockLogin = 'testUser';
            const mockUser = { 
                id: '1', 
                login: mockLogin, 
                email: 'test@example.com',
                roles: ['user']
            };
            
            req.params.login = mockLogin;
            userAccountService.getUser.mockResolvedValue(mockUser);

            // Act
            await userAccountController.getUser(req, res, next);

            // Assert
            expect(userAccountService.getUser).toHaveBeenCalledWith(mockLogin);
            expect(res.json).toHaveBeenCalledWith(mockUser);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when getUser fails', async () => {
            // Arrange
            const mockError = new Error('User not found');
            req.params.login = 'nonExistentUser';
            userAccountService.getUser.mockRejectedValue(mockError);

            // Act
            await userAccountController.getUser(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('updateUser', () => {
        it('should update a user successfully', async () => {
            // Arrange
            const mockLogin = 'testUser';
            const mockUpdateData = { 
                email: 'newemail@example.com',
                bio: 'Updated bio'
            };
            const mockUpdatedUser = { 
                id: '1', 
                login: mockLogin, 
                email: 'newemail@example.com',
                bio: 'Updated bio'
            };
            
            req.params.login = mockLogin;
            req.body = mockUpdateData;
            userAccountService.updateUser.mockResolvedValue(mockUpdatedUser);

            // Act
            await userAccountController.updateUser(req, res, next);

            // Assert
            expect(userAccountService.updateUser).toHaveBeenCalledWith(mockLogin, mockUpdateData);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when updateUser fails', async () => {
            // Arrange
            const mockError = new Error('Update failed');
            req.params.login = 'testUser';
            req.body = { email: 'invalid' };
            userAccountService.updateUser.mockRejectedValue(mockError);

            // Act
            await userAccountController.updateUser(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('addRole', () => {
        it('should add a role to user successfully', async () => {
            // Arrange
            const mockLogin = 'testUser';
            const mockRole = 'admin';
            const mockUpdatedUser = { 
                id: '1', 
                login: mockLogin, 
                roles: ['user', 'admin']
            };
            
            req.params.login = mockLogin;
            req.params.role = mockRole;
            userAccountService.changeRoles.mockResolvedValue(mockUpdatedUser);

            // Act
            await userAccountController.addRole(req, res, next);

            // Assert
            expect(userAccountService.changeRoles).toHaveBeenCalledWith(mockLogin, mockRole, true);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when addRole fails', async () => {
            // Arrange
            const mockError = new Error('Failed to add role');
            req.params.login = 'testUser';
            req.params.role = 'admin';
            userAccountService.changeRoles.mockRejectedValue(mockError);

            // Act
            await userAccountController.addRole(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('removeRole', () => {
        it('should remove a role from user successfully', async () => {
            // Arrange
            const mockLogin = 'testUser';
            const mockRole = 'admin';
            const mockUpdatedUser = { 
                id: '1', 
                login: mockLogin, 
                roles: ['user']
            };
            
            req.params.login = mockLogin;
            req.params.role = mockRole;
            userAccountService.changeRoles.mockResolvedValue(mockUpdatedUser);

            // Act
            await userAccountController.removeRole(req, res, next);

            // Assert
            expect(userAccountService.changeRoles).toHaveBeenCalledWith(mockLogin, mockRole, false);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when removeRole fails', async () => {
            // Arrange
            const mockError = new Error('Failed to remove role');
            req.params.login = 'testUser';
            req.params.role = 'admin';
            userAccountService.changeRoles.mockRejectedValue(mockError);

            // Act
            await userAccountController.removeRole(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('deleteUser', () => {
        it('should delete a user successfully', async () => {
            // Arrange
            const mockLogin = 'testUser';
            const mockDeletedUser = { 
                id: '1', 
                login: mockLogin, 
                deleted: true
            };
            
            req.params.login = mockLogin;
            userAccountService.removeUser.mockResolvedValue(mockDeletedUser);

            // Act
            await userAccountController.deleteUser(req, res, next);

            // Assert
            expect(userAccountService.removeUser).toHaveBeenCalledWith(mockLogin);
            expect(res.json).toHaveBeenCalledWith(mockDeletedUser);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when deleteUser fails', async () => {
            // Arrange
            const mockError = new Error('Failed to delete user');
            req.params.login = 'testUser';
            userAccountService.removeUser.mockRejectedValue(mockError);

            // Act
            await userAccountController.deleteUser(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('changePassword', () => {
        it('should change password successfully and return 204 status', async () => {
            // Arrange
            const mockPasswordData = {
                login: 'testUser',
                newPassword: 'newSecurePassword123'
            };
            
            req.body = mockPasswordData;
            userAccountService.changePassword.mockResolvedValue(undefined);

            // Act
            await userAccountController.changePassword(req, res, next);

            // Assert
            expect(userAccountService.changePassword).toHaveBeenCalledWith(mockPasswordData);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('should call service with request body', async () => {
            // Arrange
            const mockPasswordData = {
                login: 'anotherUser',
                newPassword: 'anotherPassword456'
            };
            
            req.body = mockPasswordData;
            userAccountService.changePassword.mockResolvedValue(undefined);

            // Act
            await userAccountController.changePassword(req, res, next);

            // Assert
            expect(userAccountService.changePassword).toHaveBeenCalledWith(mockPasswordData);
            expect(userAccountService.changePassword).toHaveBeenCalledTimes(1);
        });

        it('should return 204 with no content', async () => {
            // Arrange
            req.body = { login: 'testUser', newPassword: 'newPassword123' };
            userAccountService.changePassword.mockResolvedValue(undefined);

            // Act
            await userAccountController.changePassword(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should call next with error when changePassword fails', async () => {
            // Arrange
            const mockError = new Error('Failed to change password');
            req.body = { login: 'testUser', newPassword: 'newPassword123' };
            userAccountService.changePassword.mockRejectedValue(mockError);

            // Act
            await userAccountController.changePassword(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.end).not.toHaveBeenCalled();
        });

        it('should call next with error when user is not found', async () => {
            // Arrange
            const mockError = new Error('User not found');
            req.body = { login: 'nonExistentUser', newPassword: 'newPassword123' };
            userAccountService.changePassword.mockRejectedValue(mockError);

            // Act
            await userAccountController.changePassword(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(userAccountService.changePassword).toHaveBeenCalledWith(req.body);
        });

        it('should call next with error when validation fails', async () => {
            // Arrange
            const mockError = new Error('Invalid password format');
            req.body = { login: 'testUser', newPassword: '123' };
            userAccountService.changePassword.mockRejectedValue(mockError);

            // Act
            await userAccountController.changePassword(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});

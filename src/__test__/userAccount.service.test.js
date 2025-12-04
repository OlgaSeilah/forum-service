import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock the userAccountRepository module before importing
jest.unstable_mockModule('../repository/userAccount.repository.js', () => ({
    default: {
        createUser: jest.fn(),
        getUserByLogin: jest.fn(),
        updateUserNameOrSurname: jest.fn(),
        addRoleToUser: jest.fn(),
        deleteRoleFromUser: jest.fn(),
        removeUserByLogin: jest.fn()
    }
}));

const userAccountRepository = (await import('../repository/userAccount.repository.js')).default;
const userAccountService = (await import('../services/userAccount.service.js')).default;

describe('UserAccountService', () => {
    
    beforeEach(() => {
        // Clear all mock calls and instances before each test
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            // Arrange
            const mockUserData = { 
                login: 'testUser', 
                email: 'test@example.com', 
                password: 'password123',
                name: 'Test',
                surname: 'User'
            };
            const mockCreatedUser = { 
                _id: 'testUser',
                login: 'testUser', 
                email: 'test@example.com',
                name: 'Test',
                surname: 'User',
                roles: ['USER']
            };
            
            userAccountRepository.createUser.mockResolvedValue(mockCreatedUser);

            // Act
            const result = await userAccountService.register(mockUserData);

            // Assert
            expect(userAccountRepository.createUser).toHaveBeenCalledWith(mockUserData);
            expect(userAccountRepository.createUser).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockCreatedUser);
        });

        it('should propagate error when repository createUser fails', async () => {
            // Arrange
            const mockUserData = { 
                login: 'testUser', 
                email: 'test@example.com' 
            };
            const mockError = new Error('User already exists');
            
            userAccountRepository.createUser.mockRejectedValue(mockError);

            // Act & Assert
            await expect(userAccountService.register(mockUserData))
                .rejects.toThrow('User already exists');
            expect(userAccountRepository.createUser).toHaveBeenCalledWith(mockUserData);
        });
    });

    describe('getUser', () => {
        it('should get a user by login successfully', async () => {
            // Arrange
            const mockLogin = 'testUser';
            const mockUser = { 
                _id: mockLogin,
                login: mockLogin, 
                email: 'test@example.com',
                name: 'Test',
                surname: 'User',
                roles: ['USER']
            };
            
            userAccountRepository.getUserByLogin.mockResolvedValue(mockUser);

            // Act
            const result = await userAccountService.getUser(mockLogin);

            // Assert
            expect(userAccountRepository.getUserByLogin).toHaveBeenCalledWith(mockLogin);
            expect(userAccountRepository.getUserByLogin).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockUser);
        });

        it('should throw error when user is not found', async () => {
            // Arrange
            const mockLogin = 'nonExistentUser';
            
            userAccountRepository.getUserByLogin.mockResolvedValue(null);

            // Act & Assert
            await expect(userAccountService.getUser(mockLogin))
                .rejects.toThrow(`User with login ${mockLogin} not found`);
            expect(userAccountRepository.getUserByLogin).toHaveBeenCalledWith(mockLogin);
        });

        it('should throw error when user is undefined', async () => {
            // Arrange
            const mockLogin = 'undefinedUser';
            
            userAccountRepository.getUserByLogin.mockResolvedValue(undefined);

            // Act & Assert
            await expect(userAccountService.getUser(mockLogin))
                .rejects.toThrow(`User with login ${mockLogin} not found`);
            expect(userAccountRepository.getUserByLogin).toHaveBeenCalledWith(mockLogin);
        });

        it('should propagate error when repository getUserByLogin fails', async () => {
            // Arrange
            const mockLogin = 'testUser';
            const mockError = new Error('Database connection error');
            
            userAccountRepository.getUserByLogin.mockRejectedValue(mockError);

            // Act & Assert
            await expect(userAccountService.getUser(mockLogin))
                .rejects.toThrow('Database connection error');
            expect(userAccountRepository.getUserByLogin).toHaveBeenCalledWith(mockLogin);
        });
    });

    describe('removeUser', () => {
        it('should remove a user by login successfully', async () => {
            // Arrange
            const mockLogin = 'testUser';
            const mockDeletedUser = { 
                _id: mockLogin,
                login: mockLogin, 
                email: 'test@example.com',
                name: 'Test',
                surname: 'User'
            };
            
            userAccountRepository.removeUserByLogin.mockResolvedValue(mockDeletedUser);

            // Act
            const result = await userAccountService.removeUser(mockLogin);

            // Assert
            expect(userAccountRepository.removeUserByLogin).toHaveBeenCalledWith(mockLogin);
            expect(userAccountRepository.removeUserByLogin).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockDeletedUser);
        });

        it('should throw error when user to remove is not found', async () => {
            // Arrange
            const mockLogin = 'nonExistentUser';
            
            userAccountRepository.removeUserByLogin.mockResolvedValue(null);

            // Act & Assert
            await expect(userAccountService.removeUser(mockLogin))
                .rejects.toThrow(`User with login ${mockLogin} not found`);
            expect(userAccountRepository.removeUserByLogin).toHaveBeenCalledWith(mockLogin);
        });

        it('should throw error when user to remove is undefined', async () => {
            // Arrange
            const mockLogin = 'undefinedUser';
            
            userAccountRepository.removeUserByLogin.mockResolvedValue(undefined);

            // Act & Assert
            await expect(userAccountService.removeUser(mockLogin))
                .rejects.toThrow(`User with login ${mockLogin} not found`);
            expect(userAccountRepository.removeUserByLogin).toHaveBeenCalledWith(mockLogin);
        });

        it('should propagate error when repository removeUserByLogin fails', async () => {
            // Arrange
            const mockLogin = 'testUser';
            const mockError = new Error('Database deletion error');
            
            userAccountRepository.removeUserByLogin.mockRejectedValue(mockError);

            // Act & Assert
            await expect(userAccountService.removeUser(mockLogin))
                .rejects.toThrow('Database deletion error');
            expect(userAccountRepository.removeUserByLogin).toHaveBeenCalledWith(mockLogin);
        });
    });

    describe('updateUser', () => {
        it('should update user name and surname successfully', async () => {
            // Arrange
            const mockLogin = 'testUser';
            const mockUpdateData = { 
                name: 'UpdatedName',
                surname: 'UpdatedSurname'
            };
            const mockUpdatedUser = { 
                _id: mockLogin,
                login: mockLogin, 
                email: 'test@example.com',
                name: 'UpdatedName',
                surname: 'UpdatedSurname',
                roles: ['USER']
            };
            
            userAccountRepository.updateUserNameOrSurname.mockResolvedValue(mockUpdatedUser);

            // Act
            const result = await userAccountService.updateUser(mockLogin, mockUpdateData);

            // Assert
            expect(userAccountRepository.updateUserNameOrSurname).toHaveBeenCalledWith(mockLogin, mockUpdateData);
            expect(userAccountRepository.updateUserNameOrSurname).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockUpdatedUser);
        });

        it('should throw error when user to update is not found', async () => {
            // Arrange
            const mockLogin = 'nonExistentUser';
            const mockUpdateData = { name: 'Test' };
            
            userAccountRepository.updateUserNameOrSurname.mockResolvedValue(null);

            // Act & Assert
            await expect(userAccountService.updateUser(mockLogin, mockUpdateData))
                .rejects.toThrow(`User with login ${mockLogin} not found`);
            expect(userAccountRepository.updateUserNameOrSurname).toHaveBeenCalledWith(mockLogin, mockUpdateData);
        });

        it('should throw error when user to update is undefined', async () => {
            // Arrange
            const mockLogin = 'undefinedUser';
            const mockUpdateData = { surname: 'Test' };
            
            userAccountRepository.updateUserNameOrSurname.mockResolvedValue(undefined);

            // Act & Assert
            await expect(userAccountService.updateUser(mockLogin, mockUpdateData))
                .rejects.toThrow(`User with login ${mockLogin} not found`);
            expect(userAccountRepository.updateUserNameOrSurname).toHaveBeenCalledWith(mockLogin, mockUpdateData);
        });

        it('should propagate error when repository updateUserNameOrSurname fails', async () => {
            // Arrange
            const mockLogin = 'testUser';
            const mockUpdateData = { name: 'Test' };
            const mockError = new Error('Database update error');
            
            userAccountRepository.updateUserNameOrSurname.mockRejectedValue(mockError);

            // Act & Assert
            await expect(userAccountService.updateUser(mockLogin, mockUpdateData))
                .rejects.toThrow('Database update error');
            expect(userAccountRepository.updateUserNameOrSurname).toHaveBeenCalledWith(mockLogin, mockUpdateData);
        });
    });

    describe('changeRoles', () => {
        describe('add role', () => {
            it('should add a role to user successfully', async () => {
                // Arrange
                const mockLogin = 'testUser';
                const mockRole = 'admin';
                const mockUpdatedUser = { 
                    _id: mockLogin,
                    login: mockLogin, 
                    email: 'test@example.com',
                    roles: ['USER', 'ADMIN']
                };
                
                userAccountRepository.addRoleToUser.mockResolvedValue(mockUpdatedUser);

                // Act
                const result = await userAccountService.changeRoles(mockLogin, mockRole, true);

                // Assert
                expect(userAccountRepository.addRoleToUser).toHaveBeenCalledWith(mockLogin, 'ADMIN');
                expect(userAccountRepository.addRoleToUser).toHaveBeenCalledTimes(1);
                expect(userAccountRepository.deleteRoleFromUser).not.toHaveBeenCalled();
                expect(result).toEqual(mockUpdatedUser);
            });

            it('should convert role to uppercase when adding', async () => {
                // Arrange
                const mockLogin = 'testUser';
                const mockRole = 'moderator';
                const mockUpdatedUser = { 
                    _id: mockLogin,
                    login: mockLogin, 
                    roles: ['USER', 'MODERATOR']
                };
                
                userAccountRepository.addRoleToUser.mockResolvedValue(mockUpdatedUser);

                // Act
                await userAccountService.changeRoles(mockLogin, mockRole, true);

                // Assert
                expect(userAccountRepository.addRoleToUser).toHaveBeenCalledWith(mockLogin, 'MODERATOR');
            });

            it('should throw error when user to add role is not found', async () => {
                // Arrange
                const mockLogin = 'nonExistentUser';
                const mockRole = 'admin';
                
                userAccountRepository.addRoleToUser.mockResolvedValue(null);

                // Act & Assert
                await expect(userAccountService.changeRoles(mockLogin, mockRole, true))
                    .rejects.toThrow(`User with login ${mockLogin} not found`);
                expect(userAccountRepository.addRoleToUser).toHaveBeenCalledWith(mockLogin, 'ADMIN');
            });

            it('should throw error when user to add role is undefined', async () => {
                // Arrange
                const mockLogin = 'undefinedUser';
                const mockRole = 'admin';
                
                userAccountRepository.addRoleToUser.mockResolvedValue(undefined);

                // Act & Assert
                await expect(userAccountService.changeRoles(mockLogin, mockRole, true))
                    .rejects.toThrow(`User with login ${mockLogin} not found`);
                expect(userAccountRepository.addRoleToUser).toHaveBeenCalledWith(mockLogin, 'ADMIN');
            });

            it('should propagate error when repository addRoleToUser fails', async () => {
                // Arrange
                const mockLogin = 'testUser';
                const mockRole = 'admin';
                const mockError = new Error('Database role addition error');
                
                userAccountRepository.addRoleToUser.mockRejectedValue(mockError);

                // Act & Assert
                await expect(userAccountService.changeRoles(mockLogin, mockRole, true))
                    .rejects.toThrow('Database role addition error');
                expect(userAccountRepository.addRoleToUser).toHaveBeenCalledWith(mockLogin, 'ADMIN');
            });
        });

        describe('delete role', () => {
            it('should delete a role from user successfully', async () => {
                // Arrange
                const mockLogin = 'testUser';
                const mockRole = 'admin';
                const mockUpdatedUser = { 
                    _id: mockLogin,
                    login: mockLogin, 
                    email: 'test@example.com',
                    roles: ['USER']
                };
                
                userAccountRepository.deleteRoleFromUser.mockResolvedValue(mockUpdatedUser);

                // Act
                const result = await userAccountService.changeRoles(mockLogin, mockRole, false);

                // Assert
                expect(userAccountRepository.deleteRoleFromUser).toHaveBeenCalledWith(mockLogin, 'ADMIN');
                expect(userAccountRepository.deleteRoleFromUser).toHaveBeenCalledTimes(1);
                expect(userAccountRepository.addRoleToUser).not.toHaveBeenCalled();
                expect(result).toEqual(mockUpdatedUser);
            });

            it('should convert role to uppercase when deleting', async () => {
                // Arrange
                const mockLogin = 'testUser';
                const mockRole = 'moderator';
                const mockUpdatedUser = { 
                    _id: mockLogin,
                    login: mockLogin, 
                    roles: ['USER']
                };
                
                userAccountRepository.deleteRoleFromUser.mockResolvedValue(mockUpdatedUser);

                // Act
                await userAccountService.changeRoles(mockLogin, mockRole, false);

                // Assert
                expect(userAccountRepository.deleteRoleFromUser).toHaveBeenCalledWith(mockLogin, 'MODERATOR');
            });

            it('should throw error when user to delete role is not found', async () => {
                // Arrange
                const mockLogin = 'nonExistentUser';
                const mockRole = 'admin';
                
                userAccountRepository.deleteRoleFromUser.mockResolvedValue(null);

                // Act & Assert
                await expect(userAccountService.changeRoles(mockLogin, mockRole, false))
                    .rejects.toThrow(`User with login ${mockLogin} not found`);
                expect(userAccountRepository.deleteRoleFromUser).toHaveBeenCalledWith(mockLogin, 'ADMIN');
            });

            it('should throw error when user to delete role is undefined', async () => {
                // Arrange
                const mockLogin = 'undefinedUser';
                const mockRole = 'admin';
                
                userAccountRepository.deleteRoleFromUser.mockResolvedValue(undefined);

                // Act & Assert
                await expect(userAccountService.changeRoles(mockLogin, mockRole, false))
                    .rejects.toThrow(`User with login ${mockLogin} not found`);
                expect(userAccountRepository.deleteRoleFromUser).toHaveBeenCalledWith(mockLogin, 'ADMIN');
            });

            it('should propagate error when repository deleteRoleFromUser fails', async () => {
                // Arrange
                const mockLogin = 'testUser';
                const mockRole = 'admin';
                const mockError = new Error('Database role deletion error');
                
                userAccountRepository.deleteRoleFromUser.mockRejectedValue(mockError);

                // Act & Assert
                await expect(userAccountService.changeRoles(mockLogin, mockRole, false))
                    .rejects.toThrow('Database role deletion error');
                expect(userAccountRepository.deleteRoleFromUser).toHaveBeenCalledWith(mockLogin, 'ADMIN');
            });
        });
    });
});

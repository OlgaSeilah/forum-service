import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock the User model before importing
jest.unstable_mockModule('../model/user.model.js', () => {
    const mockSave = jest.fn();
    const mockFindById = jest.fn();
    const mockFindByIdAndUpdate = jest.fn();
    const mockFindByIdAndDelete = jest.fn();

    const MockUser = jest.fn().mockImplementation(() => ({
        save: mockSave
    }));

    MockUser.findById = mockFindById;
    MockUser.findByIdAndUpdate = mockFindByIdAndUpdate;
    MockUser.findByIdAndDelete = mockFindByIdAndDelete;

    return {
        default: MockUser
    };
});

const User = (await import('../model/user.model.js')).default;
const userAccountRepository = (await import('../repository/userAccount.repository.js')).default;

describe('UserAccountRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create and save a new user', async () => {
            const userData = {
                _id: 'testuser',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe'
            };

            const mockSavedUser = {
                _id: 'testuser',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                roles: ['USER']
            };

            User.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(mockSavedUser)
            }));

            const result = await userAccountRepository.createUser(userData);

            expect(User).toHaveBeenCalledWith(userData);
            expect(result).toBeDefined();
            expect(result).toEqual(mockSavedUser);
        });

        it('should handle save errors', async () => {
            const userData = {
                _id: 'testuser',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe'
            };

            const mockError = new Error('Database error');

            User.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(mockError)
            }));

            await expect(userAccountRepository.createUser(userData)).rejects.toThrow('Database error');
            expect(User).toHaveBeenCalledWith(userData);
        });
    });

    describe('getUserByLogin', () => {
        it('should find a user by login', async () => {
            const login = 'testuser';
            const mockUser = {
                _id: login,
                firstName: 'John',
                lastName: 'Doe',
                roles: ['USER']
            };

            User.findById.mockResolvedValue(mockUser);

            const result = await userAccountRepository.getUserByLogin(login);

            expect(User.findById).toHaveBeenCalledWith(login);
            expect(result).toEqual(mockUser);
        });

        it('should return null when user is not found', async () => {
            const login = 'nonexistent';

            User.findById.mockResolvedValue(null);

            const result = await userAccountRepository.getUserByLogin(login);

            expect(User.findById).toHaveBeenCalledWith(login);
            expect(result).toBeNull();
        });

        it('should handle errors when finding user', async () => {
            const login = 'testuser';
            const mockError = new Error('Database error');

            User.findById.mockRejectedValue(mockError);

            await expect(userAccountRepository.getUserByLogin(login)).rejects.toThrow('Database error');
            expect(User.findById).toHaveBeenCalledWith(login);
        });
    });

    describe('updateUserNameOrSurname', () => {
        it('should update user firstName', async () => {
            const login = 'testuser';
            const dataForUpdate = { firstName: 'Jane' };
            const mockUpdatedUser = {
                _id: login,
                firstName: 'Jane',
                lastName: 'Doe',
                roles: ['USER']
            };

            User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

            const result = await userAccountRepository.updateUserNameOrSurname(login, dataForUpdate);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(login, dataForUpdate, { new: true });
            expect(result).toEqual(mockUpdatedUser);
        });

        it('should update user lastName', async () => {
            const login = 'testuser';
            const dataForUpdate = { lastName: 'Smith' };
            const mockUpdatedUser = {
                _id: login,
                firstName: 'John',
                lastName: 'Smith',
                roles: ['USER']
            };

            User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

            const result = await userAccountRepository.updateUserNameOrSurname(login, dataForUpdate);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(login, dataForUpdate, { new: true });
            expect(result).toEqual(mockUpdatedUser);
        });

        it('should update both firstName and lastName', async () => {
            const login = 'testuser';
            const dataForUpdate = { firstName: 'Jane', lastName: 'Smith' };
            const mockUpdatedUser = {
                _id: login,
                firstName: 'Jane',
                lastName: 'Smith',
                roles: ['USER']
            };

            User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

            const result = await userAccountRepository.updateUserNameOrSurname(login, dataForUpdate);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(login, dataForUpdate, { new: true });
            expect(result).toEqual(mockUpdatedUser);
        });

        it('should return null when user is not found', async () => {
            const login = 'nonexistent';
            const dataForUpdate = { firstName: 'Jane' };

            User.findByIdAndUpdate.mockResolvedValue(null);

            const result = await userAccountRepository.updateUserNameOrSurname(login, dataForUpdate);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(login, dataForUpdate, { new: true });
            expect(result).toBeNull();
        });

        it('should handle errors when updating user', async () => {
            const login = 'testuser';
            const dataForUpdate = { firstName: 'Jane' };
            const mockError = new Error('Database error');

            User.findByIdAndUpdate.mockRejectedValue(mockError);

            await expect(userAccountRepository.updateUserNameOrSurname(login, dataForUpdate)).rejects.toThrow('Database error');
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(login, dataForUpdate, { new: true });
        });
    });

    describe('addRoleToUser', () => {
        it('should add a role to user', async () => {
            const login = 'testuser';
            const role = 'ADMIN';
            const mockUpdatedUser = {
                _id: login,
                firstName: 'John',
                lastName: 'Doe',
                roles: ['USER', 'ADMIN']
            };

            User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

            const result = await userAccountRepository.addRoleToUser(login, role);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                login,
                { $addToSet: { roles: role } },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedUser);
        });

        it('should not duplicate existing role', async () => {
            const login = 'testuser';
            const role = 'USER';
            const mockUpdatedUser = {
                _id: login,
                firstName: 'John',
                lastName: 'Doe',
                roles: ['USER']
            };

            User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

            const result = await userAccountRepository.addRoleToUser(login, role);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                login,
                { $addToSet: { roles: role } },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedUser);
        });

        it('should return null when user is not found', async () => {
            const login = 'nonexistent';
            const role = 'ADMIN';

            User.findByIdAndUpdate.mockResolvedValue(null);

            const result = await userAccountRepository.addRoleToUser(login, role);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                login,
                { $addToSet: { roles: role } },
                { new: true }
            );
            expect(result).toBeNull();
        });

        it('should handle errors when adding role', async () => {
            const login = 'testuser';
            const role = 'ADMIN';
            const mockError = new Error('Database error');

            User.findByIdAndUpdate.mockRejectedValue(mockError);

            await expect(userAccountRepository.addRoleToUser(login, role)).rejects.toThrow('Database error');
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                login,
                { $addToSet: { roles: role } },
                { new: true }
            );
        });
    });

    describe('deleteRoleFromUser', () => {
        it('should remove a role from user', async () => {
            const login = 'testuser';
            const role = 'ADMIN';
            const mockUpdatedUser = {
                _id: login,
                firstName: 'John',
                lastName: 'Doe',
                roles: ['USER']
            };

            User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

            const result = await userAccountRepository.deleteRoleFromUser(login, role);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                login,
                { $pull: { roles: role } },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedUser);
        });

        it('should handle removing non-existent role', async () => {
            const login = 'testuser';
            const role = 'MODERATOR';
            const mockUpdatedUser = {
                _id: login,
                firstName: 'John',
                lastName: 'Doe',
                roles: ['USER']
            };

            User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

            const result = await userAccountRepository.deleteRoleFromUser(login, role);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                login,
                { $pull: { roles: role } },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedUser);
        });

        it('should return null when user is not found', async () => {
            const login = 'nonexistent';
            const role = 'ADMIN';

            User.findByIdAndUpdate.mockResolvedValue(null);

            const result = await userAccountRepository.deleteRoleFromUser(login, role);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                login,
                { $pull: { roles: role } },
                { new: true }
            );
            expect(result).toBeNull();
        });

        it('should handle errors when removing role', async () => {
            const login = 'testuser';
            const role = 'ADMIN';
            const mockError = new Error('Database error');

            User.findByIdAndUpdate.mockRejectedValue(mockError);

            await expect(userAccountRepository.deleteRoleFromUser(login, role)).rejects.toThrow('Database error');
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                login,
                { $pull: { roles: role } },
                { new: true }
            );
        });
    });

    describe('removeUserByLogin', () => {
        it('should delete a user by login', async () => {
            const login = 'testuser';
            const mockDeletedUser = {
                _id: login,
                firstName: 'John',
                lastName: 'Doe',
                roles: ['USER']
            };

            User.findByIdAndDelete.mockResolvedValue(mockDeletedUser);

            const result = await userAccountRepository.removeUserByLogin(login);

            expect(User.findByIdAndDelete).toHaveBeenCalledWith(login);
            expect(result).toEqual(mockDeletedUser);
        });

        it('should return null when user is not found', async () => {
            const login = 'nonexistent';

            User.findByIdAndDelete.mockResolvedValue(null);

            const result = await userAccountRepository.removeUserByLogin(login);

            expect(User.findByIdAndDelete).toHaveBeenCalledWith(login);
            expect(result).toBeNull();
        });

        it('should handle errors when deleting user', async () => {
            const login = 'testuser';
            const mockError = new Error('Database error');

            User.findByIdAndDelete.mockRejectedValue(mockError);

            await expect(userAccountRepository.removeUserByLogin(login)).rejects.toThrow('Database error');
            expect(User.findByIdAndDelete).toHaveBeenCalledWith(login);
        });
    });
});

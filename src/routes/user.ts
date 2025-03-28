import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/User';

const router = Router();

// In-memory storage for users (in a real app, this would be a database)
const users: User[] = [];

// Create a new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email and password are required' 
      });
    }
    
    // Check if user with the same email already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res.status(409).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      username,
      email,
      password, // Note: In a real app, this should be hashed
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save user
    users.push(newUser);
    
    // Return success without exposing password
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete a user by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find user index
    const userIndex = users.findIndex(user => user.id === id);
    
    // Check if user exists
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Remove user from array
    users.splice(userIndex, 1);
    
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;

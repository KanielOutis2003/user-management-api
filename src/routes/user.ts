// POST create new user
router.post('/', 
    [
      body('name').isString().notEmpty().withMessage('Name is required'),
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    async (req: Request, res: Response): Promise<void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
        return;
      }
  
      try {
        // This would normally create a user in a database
        // For now, we'll return a placeholder response
        res.status(201).json({ 
          success: true, 
          message: 'User created successfully',
          data: req.body 
        });
      } catch (error: any) {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to create user', 
          error: error.message 
        });
      }
    }
  );
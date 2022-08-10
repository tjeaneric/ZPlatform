import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'sucess',
    message: 'Welcome to ZPlatform-API!',
  });
});

export default router;

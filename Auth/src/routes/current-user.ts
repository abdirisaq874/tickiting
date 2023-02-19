import express from 'express';
import { CurrentUser} from "@mandeezticketing/common/build"
const router = express.Router();

router.get('/api/users/currentuser',CurrentUser, (req, res) => {
  res.send({CurrentUser:req.currentUser || null})
});

export { router as currentUserRouter };

import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import validate from '../middlewares/validate';
import * as taskValidation from '../validations/task.validation';
import { checkJwt, extractUserId, checkRole } from '../middlewares/auth.middleware';

const router: Router = Router();

// All task routes require authentication
router.use(checkJwt);
router.use(extractUserId);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(validate(taskValidation.createTaskSchema), taskController.createTask);

router
  .route('/:id')
  .get(validate(taskValidation.getTaskSchema), taskController.getTaskById)
  .patch(validate(taskValidation.updateTaskSchema), taskController.updateTask)
  .delete(
    validate(taskValidation.deleteTaskSchema),
    checkRole('admin'),
    taskController.deleteTask,
  ); // Only admins can delete tasks

export default router;

import { Router } from "express"
import { ProblemController } from "./problem.controller"
import { authMiddleware } from "../../shared/middlewares/auth.middleware"
import { roleGuard } from "../../shared/middlewares/role-guard.middleware"
import { UserRole } from "../../shared/constants/roles"
import { validateRequest } from "../../shared/middlewares/validate.middleware"
import { createProblemValidator } from "./validators/create-problem.validator"
import { updateProblemValidator } from "./validators/update-problem.validator"

const router = Router()
const controller = new ProblemController()

router.post(
  "/",
  authMiddleware,
  roleGuard(UserRole.ADMIN),
  validateRequest(createProblemValidator),
  controller.createProblem
)

router.get(
  "/admin",
  authMiddleware,
  roleGuard(UserRole.ADMIN),
  controller.listProblems
)

// Accessible by both admin and candidates
router.get(
  "/tags",
  authMiddleware,
  roleGuard(UserRole.ADMIN, UserRole.CANDIDATE),
  controller.getProblemTags
)

// Accessible by both admin and candidates
router.get(
  "/company-tags",
  authMiddleware,
  roleGuard(UserRole.ADMIN, UserRole.CANDIDATE),
  controller.getProblemCompanyTags
)

router.get(
  "/:id",
  authMiddleware,
  roleGuard(UserRole.ADMIN, UserRole.CANDIDATE),
  controller.getProblem
)

router.patch(
  "/:id",
  authMiddleware,
  roleGuard(UserRole.ADMIN),
  validateRequest(updateProblemValidator),
  controller.updateProblem
)

router.delete(
  "/:id",
  authMiddleware,
  roleGuard(UserRole.ADMIN),
  controller.deleteProblem
)

router.get(
  "/",
  authMiddleware,
  roleGuard(UserRole.CANDIDATE),
  controller.listCandidateProblems
)

export default router
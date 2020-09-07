import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Key } from "../../entity/Key";

// Router initialization
const router = Router();

// Authentication request interface
interface AuthRequest {
  key: string;
  machineId: string;
}

/**
 * Handles an authentication request which will either
 * Register a new machineID to a key
 * Verify the machineID and key already exist in the DB (match)
 * Return the key is already bound to a different machine
 */
router.post("/verify", async (req: Request, res: Response) => {
  const authReq: AuthRequest = req.body;

  // Invalid request handler
  if (!authReq || !authReq.key || !authReq.machineId)
    return res.status(400).send({ message: "Bad request" });

  const keyRepository = getRepository(Key);

  let keyResult = await keyRepository.findOne({ key: authReq.key });

  // Invalid key handler
  if (!keyResult) return res.status(401).send({ message: "Invalid key" });

  // Key authentication handler
  if (!keyResult.machineId) {
    // Updates the machineId in the database to the supplied key
    keyResult.machineId = authReq.machineId;
    await keyRepository.save(keyResult);
    return res.status(200).send({ message: "Success" });
  } else {
    // MachineId exists within DB, return result based on if the supplied machineId matches the DB entry
    return keyResult.machineId == authReq.machineId
      ? res.status(200).json({ message: "Success" })
      : res.status(401).send({ message: "The key is already bound." });
  }
});

/**
 * Handles a reset request to have a machineID unbound from a key
 */
router.post("/reset", async (req: Request, res: Response) => {
  const authReq: AuthRequest = req.body;

  // Invalid request handler
  if (!authReq || !authReq.key)
    return res.status(400).json({ message: "Bad request" });

  const keyRepository = getRepository(Key);

  let keyResult = await keyRepository.findOne({ key: authReq.key });

  // Invalid key handler
  if (!keyResult) return res.status(401).json({ message: "Invalid key" });

  // Sets machineId to empty string and returns success
  keyResult.machineId = null;
  await keyRepository.save(keyResult);
  return res.status(200).json({ message: "Key reset" });
});

/**
 * Handles a heartbeat request to ensure the machineID
 * Is still registered to a key within the database
 */
router.get("/heartbeat/:machineId", async (req: Request, res: Response) => {
  let { machineId } = req.params;

  const keyRepository = getRepository(Key);

  let machineIdResult = await keyRepository.findOne({ machineId });

  // Returns the result of checking the DB for a record containing the supplied machineId
  return machineIdResult
    ? res.status(200).json({ message: "Success" })
    : res.status(401).json({ message: "Invalid" });
});

export default router;

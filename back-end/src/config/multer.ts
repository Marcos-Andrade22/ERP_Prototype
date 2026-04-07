import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // arquivo fica em memória, sem salvar no disco
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos CSV são permitidos"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
});

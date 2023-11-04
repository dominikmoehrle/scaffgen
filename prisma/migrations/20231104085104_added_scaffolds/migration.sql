-- CreateEnum
CREATE TYPE "Status" AS ENUM ('IGNORED', 'ACCEPTED', 'BAD');

-- CreateTable
CREATE TABLE "Prompt" (
    "id" TEXT NOT NULL,
    "prompt_content" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "needs" TEXT NOT NULL,
    "scaffolds" JSONB NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scaffold" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Scaffold_pkey" PRIMARY KEY ("id")
);

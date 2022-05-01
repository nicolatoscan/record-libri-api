-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('Readonly', 'User', 'Admin');

-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('Nuovo', 'Modificato', 'Copia', 'Bonificato');

-- CreateEnum
CREATE TYPE "NCGroup" AS ENUM ('Distrazione', 'Ortografia', 'MancataFormazione');

-- CreateEnum
CREATE TYPE "Founds" AS ENUM ('Moderno', 'Pregio', 'Antico');

-- CreateTable
CREATE TABLE "Users" (
    "username" VARCHAR(120) NOT NULL,
    "password" VARCHAR(120) NOT NULL,
    "id" SERIAL NOT NULL,
    "role" INTEGER NOT NULL,
    "libraryId" INTEGER,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Libraries" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "Libraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Records" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "libraryId" INTEGER NOT NULL,
    "authorName" VARCHAR(250),
    "formatId" INTEGER NOT NULL,
    "recordType" "RecordType",
    "addedById" INTEGER NOT NULL,
    "dateAdded" DATE NOT NULL,
    "found" "Founds" NOT NULL,

    CONSTRAINT "Records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonCompliances" (
    "id" SERIAL NOT NULL,
    "recordId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "language" CHAR(3) NOT NULL,
    "libraryId" INTEGER NOT NULL,
    "formatId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "group" "NCGroup" NOT NULL,
    "dateAdded" DATE NOT NULL,

    CONSTRAINT "NonCompliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formats" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "RecordTypes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Libraries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Records" ADD CONSTRAINT "Records_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Records" ADD CONSTRAINT "Records_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Libraries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Records" ADD CONSTRAINT "Records_typeId_fkey" FOREIGN KEY ("formatId") REFERENCES "Formats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NonCompliances" ADD CONSTRAINT "NonCompliance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NonCompliances" ADD CONSTRAINT "NonCompliance_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Libraries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NonCompliances" ADD CONSTRAINT "NonCompliance_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NonCompliances" ADD CONSTRAINT "NonCompliance_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NonCompliances" ADD CONSTRAINT "NonCompliance_recordTypeId_fkey" FOREIGN KEY ("formatId") REFERENCES "Formats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

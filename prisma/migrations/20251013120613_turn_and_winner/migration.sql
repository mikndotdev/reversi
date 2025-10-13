-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "turn" "Color" NOT NULL DEFAULT 'BLACK',
ADD COLUMN     "winner" "Color";

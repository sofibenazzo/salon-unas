/*
  Warnings:

  - A unique constraint covering the columns `[fechaHora]` on the table `Turno` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[HorarioAtencion] (
    [id] INT NOT NULL IDENTITY(1,1),
    [diaSemana] INT NOT NULL,
    [horaInicio] NVARCHAR(1000) NOT NULL,
    [horaFin] NVARCHAR(1000) NOT NULL,
    [activo] BIT NOT NULL CONSTRAINT [HorarioAtencion_activo_df] DEFAULT 1,
    CONSTRAINT [HorarioAtencion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[Turno] ADD CONSTRAINT [Turno_fechaHora_key] UNIQUE NONCLUSTERED ([fechaHora]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

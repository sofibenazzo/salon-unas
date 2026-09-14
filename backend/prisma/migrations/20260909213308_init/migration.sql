BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [apellido] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [telefono] NVARCHAR(1000),
    [password] NVARCHAR(1000) NOT NULL,
    [rol] NVARCHAR(1000) NOT NULL CONSTRAINT [Usuario_rol_df] DEFAULT 'CLIENTE',
    [activo] BIT NOT NULL CONSTRAINT [Usuario_activo_df] DEFAULT 1,
    [creadoEn] DATETIME2 NOT NULL CONSTRAINT [Usuario_creadoEn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Usuario_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Usuario_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Servicio] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [descripcion] NVARCHAR(1000),
    [precio] DECIMAL(10,2) NOT NULL,
    [duracion] INT NOT NULL,
    [activo] BIT NOT NULL CONSTRAINT [Servicio_activo_df] DEFAULT 1,
    [creadoEn] DATETIME2 NOT NULL CONSTRAINT [Servicio_creadoEn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Servicio_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Turno] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fechaHora] DATETIME2 NOT NULL,
    [estado] NVARCHAR(1000) NOT NULL CONSTRAINT [Turno_estado_df] DEFAULT 'PENDIENTE',
    [observacion] NVARCHAR(1000),
    [usuarioId] INT NOT NULL,
    [servicioId] INT NOT NULL,
    [creadoEn] DATETIME2 NOT NULL CONSTRAINT [Turno_creadoEn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Turno_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Turno] ADD CONSTRAINT [Turno_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Turno] ADD CONSTRAINT [Turno_servicioId_fkey] FOREIGN KEY ([servicioId]) REFERENCES [dbo].[Servicio]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

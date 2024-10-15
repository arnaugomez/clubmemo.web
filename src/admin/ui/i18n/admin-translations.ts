const adminTranslations: Record<string, string> = {
  "courseEnrollments.description":
    "Las inscripciones a cursos contienen la información de un perfil inscrito en un curso, incluido sus preferencias de cómo realizar las sesiones de práctica.",
  "courseEnrollments.field.config.label": "Configuración",
  "courseEnrollments.field.config.tableHeader": "Configuración",
  "courseEnrollments.field.courseId.label": "Id del curso",
  "courseEnrollments.field.courseId.placeholder":
    "El curso al que se inscribe el perfil",
  "courseEnrollments.field.courseId.tableHeader": "Id del curso",
  "courseEnrollments.field.dailyNewCardsCount.label":
    "Cantidad diaria de tarjetas nuevas",
  "courseEnrollments.field.dailyNewCardsCount.placeholder":
    "Cuántas tarjetas quieres empezar a aprender cada día",
  "courseEnrollments.field.enableFuzz.label": "Permitir aleatoriedad",
  "courseEnrollments.field.isFavorite.label": "Es favorito",
  "courseEnrollments.field.isFavorite.tableHeader": "Favorito",
  "courseEnrollments.field.maximumInterval.label": "Intervalo máximo",
  "courseEnrollments.field.maximumInterval.placeholder":
    "El intervalo máximo entre repeticiones de una tarjeta (en días)",
  "courseEnrollments.field.profileId.label": "Id del perfil",
  "courseEnrollments.field.profileId.placeholder":
    "El perfil inscrito en el curso",
  "courseEnrollments.field.profileId.tableHeader": "Id del perfil",
  "courseEnrollments.field.requestRetention.label": "Retención esperada",
  "courseEnrollments.field.requestRetention.placeholder":
    "Proporción de tarjetas que esperas responder correctamente. Se mide en tanto por 1. Es un parámetro importante del algoritmo: un valor alto implica una mayor carga de trabajo. Recomendamos un valor entre 0.70 y 0.97",
  "courseEnrollments.field.showAdvancedRatingOptions.label":
    "Mostrar opciones de calificación avanzadas",
  "courseEnrollments.plural": "Inscripciones a cursos",
  "courseEnrollments.plural.lowercase": "inscripciones a cursos",
  "courseEnrollments.singular": "Inscripción a curso",
  "courseEnrollments.singular.lowercase": "inscripción a curso",
  "coursePermissions.description":
    "Indican los perfiles que tienen acceso a un curso y qué permisos tienen sobre él (ver, editar, administrar, etc.).",
  "coursePermissions.field.courseId.label": "Id del curso",
  "coursePermissions.field.courseId.placeholder":
    "El curso al que se asigna el permiso",
  "coursePermissions.field.courseId.tableHeader": "Id del curso",
  "coursePermissions.field.permissionType.label": "Tipo de permiso",
  "coursePermissions.field.permissionType.option.edit.label": "Editar",
  "coursePermissions.field.permissionType.option.own.label": "Propietario",
  "coursePermissions.field.permissionType.option.view.label": "Ver",
  "coursePermissions.field.permissionType.placeholder": "El tipo de permiso",
  "coursePermissions.field.permissionType.tableHeader": "Tipo de permiso",
  "coursePermissions.field.profileId.label": "Id del perfil",
  "coursePermissions.field.profileId.placeholder":
    "El perfil al que se asigna el permiso",
  "coursePermissions.field.profileId.tableHeader": "Id del perfil",
  "coursePermissions.plural": "Permisos de curso",
  "coursePermissions.plural.lowercase": "permisos de curso",
  "coursePermissions.singular": "Permiso de curso",
  "coursePermissions.singular.lowercase": "permiso de curso",
  "courses.deleteAlert.description":
    "Se eliminarán los datos de permisos, inscripciones y notas asociadas al curso.",
  "courses.deleteAlert.title": "También se eliminarán los datos asociados",
  "courses.description":
    "Un curso es una colección de tarjetas de aprendizaje. Los usuarios de Clubmemo pueden inscribirse a cursos y practicar sus tarjetas.",
  "courses.field.description.label": "Descripción",
  "courses.field.description.placeholder": "Descripción del curso",
  "courses.field.description.tableHeader": "Descripción",
  "courses.field.isPublic.label": "Curso público",
  "courses.field.isPublic.tableHeader": "Público",
  "courses.field.name.label": "Nombre del curso",
  "courses.field.name.placeholder": "Matematicas 101",
  "courses.field.name.tableHeader": "Nombre",
  "courses.field.picture.label": "Imagen del curso",
  "courses.field.picture.tableHeader": "Imagen",
  "courses.field.tags.label": "Etiquetas del curso",
  "courses.field.tags.placeholder": "Matemáticas, Física, Química...",
  "courses.field.tags.tableHeader": "Etiquetas",
  "courses.plural": "Cursos",
  "courses.plural.lowercase": "cursos",
  "courses.singular": "Curso",
  "courses.singular.lowercase": "curso",
  "emailVerificationCodes.description":
    "Los códigos de verificación de correo electrónico se utilizan para comprobar que la dirección de correo electrónico de un usuario existe. Un usuario debe verificar su dirección de correo electrónico antes de tener pleno acceso a la plataforma.",
  "emailVerificationCodes.field.code.label": "Código",
  "emailVerificationCodes.field.code.placeholder": "El código de verificación",
  "emailVerificationCodes.field.code.tableHeader": "Código",
  "emailVerificationCodes.field.expiresAt.label": "Fecha de expiración",
  "emailVerificationCodes.field.expiresAt.placeholder":
    "La fecha en que expira el código",
  "emailVerificationCodes.field.expiresAt.tableHeader": "Fecha de expiración",
  "emailVerificationCodes.field.userId.label": "Id del usuario",
  "emailVerificationCodes.field.userId.placeholder":
    "El usuario que solicita el código",
  "emailVerificationCodes.field.userId.tableHeader": "Id de usuario",
  "emailVerificationCodes.plural":
    "Códigos de verificación de correo electrónico",
  "emailVerificationCodes.plural.lowercase":
    "códigos de verificación de correo electrónico",
  "emailVerificationCodes.singular":
    "Código de verificación de correo electrónico",
  "emailVerificationCodes.singular.lowercase":
    "código de verificación de correo electrónico",
  "fileUploads.description":
    "Mantienen un registro de los ficheros subidos. Permiten comprobar el estado de las subidas y eliminar del sistema los ficheros que ya no se usan.",
  "fileUploads.field.collection.label": "Colección de base de datos",
  "fileUploads.field.collection.option.courses.label": "Cursos",
  "fileUploads.field.collection.option.profiles.label": "Perfiles",
  "fileUploads.field.collection.placeholder":
    "La colección de la base de datos en la que se guarda la URL del archivo",
  "fileUploads.field.collection.tableHeader": "Colección",
  "fileUploads.field.contentType.label": "Tipo de contenido",
  "fileUploads.field.contentType.placeholder":
    "El tipo de contenido del archivo",
  "fileUploads.field.contentType.tableHeader": "Tipo de contenido",
  "fileUploads.field.createdAt.label": "Fecha de creación",
  "fileUploads.field.createdAt.tableHeader": "Fecha de creación",
  "fileUploads.field.createdByUserId.label": "Id del usuario",
  "fileUploads.field.createdByUserId.placeholder":
    "El usuario que subió el archivo",
  "fileUploads.field.createdByUserId.tableHeader": "Id del usuario",
  "fileUploads.field.field.label": "Campo de la colección",
  "fileUploads.field.field.placeholder":
    "El campo de la colección en el que se guarda la URL del archivo",
  "fileUploads.field.field.tableHeader": "Campo",
  "fileUploads.field.key.label": "Clave",
  "fileUploads.field.key.placeholder": "La clave del archivo en S3",
  "fileUploads.field.key.tableHeader": "Clave",
  "fileUploads.field.url.label": "URL",
  "fileUploads.field.url.placeholder": "La URL del archivo",
  "fileUploads.field.url.tableHeader": "URL",
  "fileUploads.field.userId.label": "Id del usuario",
  "fileUploads.plural": "Subidas de ficheros",
  "fileUploads.plural.lowercase": "subidas de ficheros",
  "fileUploads.singular": "Subida de fichero",
  "fileUploads.singular.lowercase": "subida de fichero",
  "forgotPasswordTokens.description":
    "Los tokens de recuperación de contraseña se utilizan para restablecer la contraseña de un usuario que ha perdido sus credenciales de acceso.",
  "forgotPasswordTokens.field.expiresAt.label": "Fecha de expiración",
  "forgotPasswordTokens.field.expiresAt.placeholder":
    "La fecha en que expira el token",
  "forgotPasswordTokens.field.expiresAt.tableHeader": "Fecha de expiración",
  "forgotPasswordTokens.field.userId.label": "Id de usuario",
  "forgotPasswordTokens.field.userId.placeholder":
    "El usuario que solicita el token",
  "forgotPasswordTokens.field.userId.tableHeader": "Id de usuario",
  "forgotPasswordTokens.plural": "Tokens de recuperación de contraseña",
  "forgotPasswordTokens.plural.lowercase":
    "tokens de recuperación de contraseña",
  "forgotPasswordTokens.singular": "Token de recuperación de contraseña",
  "forgotPasswordTokens.singular.lowercase":
    "token de recuperación de contraseña",
  "notes.description":
    "Las notas o flashcards son fragmentos de información que se utilizan para estudiar y recordar conceptos. Contienen una parte frontal (pregunta) y una parte trasera (respuesta).",
  "notes.field.back.label": "Revés",
  "notes.field.back.placeholder": "La respuesta, definición o explicación",
  "notes.field.back.tableHeader": "Revés",
  "notes.field.courseId.label": "Identificador del curso",
  "notes.field.courseId.placeholder": "El curso al que pertenece la nota",
  "notes.field.courseId.tableHeader": "Id del curso",
  "notes.field.createdAt.label": "Fecha de creación",
  "notes.field.createdAt.tableHeader": "Fecha de creación",
  "notes.field.front.label": "Cara",
  "notes.field.front.placeholder":
    "La pregunta o concepto que quieres recordar",
  "notes.field.front.tableHeader": "Cara",
  "notes.plural": "Notas",
  "notes.plural.lowercase": "notas",
  "notes.singular": "Nota",
  "notes.singular.lowercase": "nota",
  "practiceCards.description":
    "Las tarjetas de práctica contienen el estado de conocimiento de un estudiante sobre una determinada nota. Miden el progreso del estudiante. Mediante el algoritmo FSRS, los datos de las tarjetas de práctica determinan qué tarjetas se deben practicar en la siguiente sesión de estudio.",
  "practiceCards.field.courseEnrollmentId.label": "Id de inscripción",
  "practiceCards.field.courseEnrollmentId.placeholder":
    "La inscripción al curso",
  "practiceCards.field.courseEnrollmentId.tableHeader": "Id de inscripción",
  "practiceCards.field.difficulty.label": "Dificultad",
  "practiceCards.field.difficulty.placeholder": "La dificultad de la tarjeta",
  "practiceCards.field.difficulty.tableHeader": "Dificultad",
  "practiceCards.field.due.label": "Próxima revisión",
  "practiceCards.field.due.placeholder": "La fecha de la próxima revisión",
  "practiceCards.field.due.tableHeader": "Próxima revisión",
  "practiceCards.field.elapsedDays.label": "Días transcurridos",
  "practiceCards.field.elapsedDays.placeholder": "Los días transcurridos",
  "practiceCards.field.elapsedDays.tableHeader": "Días transcurridos",
  "practiceCards.field.lapses.label": "Fallos",
  "practiceCards.field.lapses.placeholder": "Los fallos",
  "practiceCards.field.lapses.tableHeader": "Fallos",
  "practiceCards.field.lastReview.label": "Última revisión",
  "practiceCards.field.lastReview.placeholder":
    "La fecha de la última revisión",
  "practiceCards.field.lastReview.tableHeader": "Última revisión",
  "practiceCards.field.noteId.label": "Id de nota",
  "practiceCards.field.noteId.placeholder": "La nota a practicar",
  "practiceCards.field.noteId.tableHeader": "Id de nota",
  "practiceCards.field.reps.label": "Repeticiones",
  "practiceCards.field.reps.placeholder": "Las repeticiones",
  "practiceCards.field.reps.tableHeader": "Repeticiones",
  "practiceCards.field.scheduledDays.label": "Días programados",
  "practiceCards.field.scheduledDays.placeholder": "Los días programados",
  "practiceCards.field.scheduledDays.tableHeader": "Días programados",
  "practiceCards.field.stability.label": "Estabilidad",
  "practiceCards.field.stability.placeholder": "La estabilidad de la tarjeta",
  "practiceCards.field.stability.tableHeader": "Estabilidad",
  "practiceCards.field.state.label": "Estado",
  "practiceCards.field.state.option.learning.label": "Aprendiendo",
  "practiceCards.field.state.option.new.label": "Nueva sin practicar",
  "practiceCards.field.state.option.relearning.label": "Reaprendiendo",
  "practiceCards.field.state.option.review.label": "Revisando",
  "practiceCards.field.state.placeholder": "El estado de la tarjeta",
  "practiceCards.field.state.tableHeader": "Estado",
  "practiceCards.plural": "Tarjetas de práctica",
  "practiceCards.plural.lowercase": "tarjetas de práctica",
  "practiceCards.singular": "Tarjeta de práctica",
  "practiceCards.singular.lowercase": "tarjeta de práctica",
  "profiles.deleteAlert.description":
    "Cuando eliminas un perfil, también se eliminan los datos de sesiones y del usuario asociado.",
  "profiles.deleteAlert.title": "También se eliminará el usuario asociado",
  "profiles.description":
    "Los perfiles contienen la información y preferencias del usuario, que definen sus interacciones con la plataforma y su comunidad.",
  "profiles.field.backgroundPicture.label": "Imagen de fondo",
  "profiles.field.backgroundPicture.tableHeader": "Imagen de fondo",
  "profiles.field.bio.label": "Bio",
  "profiles.field.bio.placeholder": "Cuéntanos algo sobre ti",
  "profiles.field.bio.tableHeader": "Bio",
  "profiles.field.displayName.label": "Nombre",
  "profiles.field.displayName.placeholder": "Tu nombre de usuario",
  "profiles.field.displayName.tableHeader": "Nombre",
  "profiles.field.handle.label": "Identificador",
  "profiles.field.handle.placeholder":
    "Tu identificador, como en X o Instagram",
  "profiles.field.handle.tableHeader": "Identificador (handle)",
  "profiles.field.isPublic.label": "Perfil público",
  "profiles.field.isPublic.tableHeader": "Público",
  "profiles.field.picture.label": "Imagen de perfil",
  "profiles.field.picture.tableHeader": "Foto de perfil",
  "profiles.field.tags.label": "Etiquetas",
  "profiles.field.tags.placeholder": "Tus intereses, asignaturas...",
  "profiles.field.tags.tableHeader": "Etiquetas",
  "profiles.field.userId.label": "Id del usuario",
  "profiles.field.userId.placeholder": "El usuario asociado al perfil",
  "profiles.field.userId.tableHeader": "Id de usuario",
  "profiles.field.website.label": "Página web",
  "profiles.field.website.placeholder":
    "Enlace a tu página web o redes sociales",
  "profiles.field.website.tableHeader": "Página web",
  "profiles.plural": "Perfiles",
  "profiles.plural.lowercase": "perfiles",
  "profiles.singular": "Perfil",
  "profiles.singular.lowercase": "perfil",
  "rateLimits.description":
    "Se usan para limitar la cantidad de operaciones que un usuario puede realizar en un período de tiempo determinado. Permiten mitigar los ataques DoS.",
  "rateLimits.field.count.label": "Contador",
  "rateLimits.field.count.placeholder":
    "Veces que se ha realizado la operación desde que se reinició el contador",
  "rateLimits.field.count.tableHeader": "Contador",
  "rateLimits.field.name.label": "Nombre de operación",
  "rateLimits.field.name.placeholder":
    "Identificador de la operación realizada",
  "rateLimits.field.name.tableHeader": "Nombre",
  "rateLimits.field.updatedAt.label": "Fecha de actualización",
  "rateLimits.field.updatedAt.placeholder":
    "La fecha de la última vez que se puso a cero el contador",
  "rateLimits.field.updatedAt.tableHeader": "Fecha de actualización",
  "rateLimits.plural": "Límites de ratio",
  "rateLimits.plural.lowercase": "límites de ratio",
  "rateLimits.singular": "Límite de ratio",
  "rateLimits.singular.lowercase": "límite de ratio",
  "reviewLogs.description":
    "Los registros de revisión contienen el resultado de practicar una tarjeta. Sirven para medir el desempeño del estudiante a lo largo del tiempo.",
  "reviewLogs.field.cardId.label": "Id de tarjeta",
  "reviewLogs.field.cardId.placeholder": "La tarjeta revisada",
  "reviewLogs.field.cardId.tableHeader": "Id de tarjeta",
  "reviewLogs.field.courseEnrollmentId.label": "Id de inscripción",
  "reviewLogs.field.courseEnrollmentId.placeholder": "La inscripción al curso",
  "reviewLogs.field.courseEnrollmentId.tableHeader": "Id de inscripción",
  "reviewLogs.field.difficulty.label": "Dificultad",
  "reviewLogs.field.difficulty.placeholder": "La dificultad de la tarjeta",
  "reviewLogs.field.difficulty.tableHeader": "Dificultad",
  "reviewLogs.field.due.label": "Próxima revisión",
  "reviewLogs.field.due.placeholder": "La fecha de la próxima revisión",
  "reviewLogs.field.due.tableHeader": "Próxima revisión",
  "reviewLogs.field.elapsedDays.label": "Días transcurridos",
  "reviewLogs.field.elapsedDays.placeholder": "Los días transcurridos",
  "reviewLogs.field.elapsedDays.tableHeader": "Días transcurridos",
  "reviewLogs.field.lastElapsedDays.label":
    "Días transcurridos desde la última revisión",
  "reviewLogs.field.lastElapsedDays.placeholder":
    "Los días transcurridos en la última revisión",
  "reviewLogs.field.lastElapsedDays.tableHeader":
    "Días desde la última revisión",
  "reviewLogs.field.rating.label": "Valoración",
  "reviewLogs.field.rating.option.again.label": "Repetir",
  "reviewLogs.field.rating.option.easy.label": "Fácil",
  "reviewLogs.field.rating.option.good.label": "Bien",
  "reviewLogs.field.rating.option.hard.label": "Difícil",
  "reviewLogs.field.rating.option.manual.label": "Valorado manualmente",
  "reviewLogs.field.rating.placeholder": "La valoración de la tarjeta",
  "reviewLogs.field.rating.tableHeader": "Valoración",
  "reviewLogs.field.review.label": "Fecha de revisión",
  "reviewLogs.field.review.placeholder": "La fecha en que se revisó la tarjeta",
  "reviewLogs.field.review.tableHeader": "Fecha de revisión",
  "reviewLogs.field.scheduledDays.label": "Días programados",
  "reviewLogs.field.scheduledDays.placeholder": "Los días programados",
  "reviewLogs.field.scheduledDays.tableHeader": "Días programados",
  "reviewLogs.field.stability.label": "Estabilidad",
  "reviewLogs.field.stability.placeholder": "La estabilidad de la tarjeta",
  "reviewLogs.field.stability.tableHeader": "Estabilidad",
  "reviewLogs.field.state.label": "Estado",
  "reviewLogs.field.state.option.learning.label": "Aprendiendo",
  "reviewLogs.field.state.option.new.label": "Nueva sin practicar",
  "reviewLogs.field.state.option.relearning.label": "Reaprendiendo",
  "reviewLogs.field.state.option.review.label": "Revisando",
  "reviewLogs.field.state.placeholder": "El estado de la tarjeta",
  "reviewLogs.field.state.tableHeader": "Estado",
  "reviewLogs.plural": "Registros de revisión",
  "reviewLogs.plural.lowercase": "registros de revisión",
  "reviewLogs.singular": "Registro de revisión",
  "reviewLogs.singular.lowercase": "registro de revisión",
  "sessions.description":
    "Las sesiones persisten el acceso a la plataforma de un usuario. Evitan que el usuario tenga que iniciar sesión cada vez que accede a la plataforma.",
  "sessions.field.expires_at.label": "Fecha de expiración",
  "sessions.field.expires_at.placeholder": "La fecha en que expira la sesión",
  "sessions.field.expires_at.tableHeader": "Fecha de expiración",
  "sessions.field.user_id.label": "Id de usuario",
  "sessions.field.user_id.placeholder": "El usuario que inició la sesión",
  "sessions.field.user_id.tableHeader": "Id de usuario",
  "sessions.plural": "Sesiones",
  "sessions.plural.lowercase": "sesiones",
  "sessions.singular": "Sesión",
  "sessions.singular.lowercase": "sesión",
  "tags.description":
    "Las etiquetas se usan para clasificar los cursos y perfiles y proporcionar recomendaciones personalizadas a los usuarios según sus intereses.",
  "tags.field.name.label": "Nombre",
  "tags.field.name.placeholder": "El texto de la etiqueta",
  "tags.field.name.tableHeader": "Nombre",
  "tags.plural": "Etiquetas",
  "tags.plural.lowercase": "etiquetas",
  "tags.singular": "Etiqueta",
  "tags.singular.lowercase": "etiqueta",
  "users.createAlert.description":
    "Después de crear el usuario, crea un perfil y enlázalo a este usuario para que pueda usar la plataforma.",
  "users.createAlert.title": "Recuerda asociar el usuario a un perfil",
  "users.deleteAlert.description":
    "Cuando eliminas un usuario, también se eliminan todos los datos de perfiles y sesiones asociadas.",
  "users.deleteAlert.title": "También se eliminarán los perfiles asociados",
  "users.description":
    "Contienen las credenciales de acceso a la plataforma. Cada usuario se encuentra asociado a un perfil.",
  "users.field.acceptTerms.label": "Acepta los términos y condiciones",
  "users.field.authTypes.label": "Modos de autenticación",
  "users.field.authTypes.option.email.label": "Email y contraseña",
  "users.field.authTypes.placeholder": "Con email, con Google, etc.",
  "users.field.email.label": "Correo electrónico",
  "users.field.email.placeholder": "ejemplo@clubmemo.com",
  "users.field.isAdmin.label": "Es administrador",
  "users.field.isEmailVerified.label": "Email verificado",
  "users.field.newPassword.label": "Nueva contraseña",
  "users.field.newPassword.placeholder": "Elige una contraseña segura",
  "users.field.acceptTerms.tableHeader": "Acepta los términos",
  "users.field.authTypes.tableHeader": "Modos de autenticación",
  "users.field.email.tableHeader": "Email",
  "users.field.isAdmin.tableHeader": "Administrador",
  "users.field.isEmailVerified.tableHeader": "Email verificado",
  "users.field.profile.tableHeader": "Perfil",
  "users.field.profile.label": "Perfil",
  "users.field.profile.placeholder": "El perfil asociado al usuario",
  "users.field.profile.view": "Ver perfil",
  "users.plural": "Usuarios",
  "users.plural.lowercase": "usuarios",
  "users.singular": "Usuario",
  "users.singular.lowercase": "usuario",
};

export function translateAdminKey(...keys: string[]): string {
  const key = keys.join(".");
  return adminTranslations[key] || key;
}

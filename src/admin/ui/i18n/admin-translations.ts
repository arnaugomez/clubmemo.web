const adminTranslations: Record<string, string> = {
  "tags.plural": "Etiquetas",
  "tags.singular": "Etiqueta",
  "tags.description":
    "Las etiquetas se usan para clasificar los cursos y perfiles y proporcionar recomendaciones personalizadas a los usuarios según sus intereses.",
  "reviewLogs.plural": "Registros de revisión",
  "reviewLogs.singular": "Registro de revisión",
  "reviewLogs.description":
    "Los registros de revisión contienen el resultado de practicar una tarjeta. Sirven para medir el desempeño del estudiante a lo largo del tiempo.",
  "rateLimits.plural": "Límites de ratio",
  "rateLimits.singular": "Límite de ratio",
  "rateLimits.description":
    "Se usan para limitar la cantidad de operaciones que un usuario puede realizar en un período de tiempo determinado. Permiten mitigar los ataques DoS.",
  "profiles.plural": "Perfiles",
  "profiles.singular": "Perfil",
  "profiles.description":
    "Los perfiles contienen la información y preferencias del usuario, con las que interactúa con la plataforma y su comunidad.",
  "practiceCards.plural": "Tarjetas de práctica",
  "practiceCards.singular": "Tarjeta de práctica",
  "practiceCards.description":
    "Las tarjetas de práctica contienen el estado de conocimiento de un estudiante sobre una determinada nota. Miden el progreso del estudiante. Mediante el algoritmo FSRS, los datos de las tarjetas de práctica determinan qué tarjetas se deben practicar en la siguiente sesión de estudio.",
  "notes.plural": "Notas",
  "notes.singular": "Nota",
  "notes.description":
    "Las notas o flashcards son fragmentos de información que se utilizan para estudiar y recordar conceptos. Contienen una parte frontal (pregunta) y una parte trasera (respuesta).",
  "forgotPasswordTokens.plural": "Tokens de recuperación de contraseña",
  "forgotPasswordTokens.singular": "Token de recuperación de contraseña",
  "forgotPasswordTokens.description":
    "Los tokens de recuperación de contraseña se utilizan para restablecer la contraseña de un usuario que ha olvidado su contraseña.",
  "emailVerificationCodes.plural":
    "Códigos de verificación de correo electrónico",
  "emailVerificationCodes.singular":
    "Código de verificación de correo electrónico",
  "emailVerificationCodes.description":
    "Los códigos de verificación de correo electrónico se utilizan para comprobar que la dirección de correo electrónico de un usuario existe. Un usuario debe verificar su dirección de correo electrónico antes de tener pleno acceso a la plataforma.",
  "fileUploads.plural": "Subidas de ficheros",
  "fileUploads.singular": "Subida de fichero",
  "fileUploads.description":
    "Mantienen un registro de los ficheros subidos. Permiten comprobar el estado de las subidas y eliminar del sistema los ficheros que ya no se usan.",
  "courseEnrollments.plural": "Inscripciones de cursos",
  "courseEnrollments.singular": "Inscripción de curso",
  "courseEnrollments.description":
    "Las inscripciones de cursos contienen la información de un perfil inscrito en un curso, incluido sus preferencias de cómo realizar las sesiones de práctica.",
  "coursePermissions.plural": "Permisos de curso",
  "coursePermissions.singular": "Permiso de curso",
  "coursePermissions.description":
    "Indican los perfiles que tienen acceso a un curso y qué permisos tienen sobre él (ver, editar, administrar, etc.).",
  "courses.plural": "Cursos",
  "courses.singular": "Curso",
  "courses.description":
    "Un curso es una colección de tarjetas de aprendizaje. Los usuarios de Clubmemo pueden inscribirse a cursos y practicar sus tarjetas.",
  "sessions.plural": "Sesiones",
  "sessions.singular": "Sesión",
  "sessions.description":
    "Las sesiones persisten el acceso a la plataforma de un usuario. Evitan que el usuario tenga que iniciar sesión cada vez que accede a la plataforma.",
  "users.plural": "Usuarios",
  "users.singular": "Usuario",
  "users.description":
    "Contienen las credenciales de acceso a la plataforma. Cada usuario se encuentra asociado a un perfil.",
};

export function translateAdminKey(...keys: string[]): string {
  const key = keys.join(".");
  return adminTranslations[key] || key;
}

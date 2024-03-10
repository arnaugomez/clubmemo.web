"use server";

interface SignupViewModel {
  email: string;
  password: string;
}

export async function signupAction(data: SignupViewModel) {
  console.log(data);
  // const username = formData.get("username");
  // // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // // keep in mind some database (e.g. mysql) are case insensitive
  // if (
  // 	typeof username !== "string" ||
  // 	username.length < 3 ||
  // 	username.length > 31 ||
  // 	!/^[a-z0-9_-]+$/.test(username)
  // ) {
  // 	return {
  // 		error: "Invalid username"
  // 	};
  // }
  // const password = formData.get("password");
  // if (typeof password !== "string" || password.length < 6 || password.length > 255) {
  // 	return {
  // 		error: "Invalid password"
  // 	};
  // }

  // const hashedPassword = await new Argon2id().hash(password);
  // const userId = generateId(15);

  // // TODO: check if username is already used
  // await db.table("user").insert({
  // 	id: userId,
  // 	username: username,
  // 	hashed_password: hashedPassword
  // });

  // const session = await lucia.createSession(userId, {});
  // const sessionCookie = lucia.createSessionCookie(session.id);
  // cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  // return redirect("/");
}

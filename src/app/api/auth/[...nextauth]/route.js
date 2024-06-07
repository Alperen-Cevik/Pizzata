
import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import users from "../../../../../public/db/users.json";

export const authOptions = {
  secret: "randomasssecret",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;

        console.log("credentials: ", email, password);

        let response = await fetch(
          "http://localhost:8080/login?email=" + email + "&password=" + password
        );

        response = await response.text();

        console.log("response: ", response);

        if (response == "failed") return null;

        response =  JSON.parse(response);

        console.log("response: ", response);


        return response;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.role = user.role;
        token.banned = user.banned;
        token.streetAddress = user.streetAddress;
        token.postalCode = user.postalCode;
        token.city = user.city;
        token.country = user.country;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.role = token.role;
        session.user.banned = token.banned;
        session.user.streetAddress = token.streetAddress;
        session.user.postalCode = token.postalCode;
        session.user.city = token.city;
        session.user.country = token.country;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
};

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const user = users.find((user) => user.email === userEmail);
  if (!user) {
    return false;
  }
  if (user.role == "Admin") return true;
  else return false;
}

export async function isCourier() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const user = users.find((user) => user.email === userEmail);
  if (!user) {
    return false;
  }
  if (user.role == "Courier") return true;
  else return false;
}

export async function isRestaurant() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const user = users.find((user) => user.email === userEmail);
  if (!user) {
    return false;
  }
  if (user.role == "Restaurant") return true;
  else return false;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

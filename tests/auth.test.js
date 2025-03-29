const request = require("supertest");
const app = require("../index"); // Import your Express app
const { JWT_SECRET } = require("../config/constants");
const jwt = require("jsonwebtoken");

describe("Authentication API", () => {
    it("should return 400 if email or password is missing", async () => {
        const res = await request(app).post("/auth").send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "Email and password are required");
    });

    it("should return 401 for incorrect password", async () => {
        const res = await request(app).post("/auth").send({
            email: "yash@yenmo.in",
            password: "wrongpassword",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should return 401 for incorrect username", async () => {
        const res = await request(app).post("/auth").send({
            email: "wrongusername",
            password: "abc123",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should return 404 for incorrect endpoint", async () => {
        const res = await request(app).post("/wrong").send({
            email: "yash@yenmo.in",
            password: "abc123",
        });
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "Cannot POST");
    });

    it("should return 200 and a token for valid credentials", async () => {
        const res = await request(app).post("/auth").send({
            email: "yash@yenmo.in",
            password: "abc123",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("auth_token");

    });
});

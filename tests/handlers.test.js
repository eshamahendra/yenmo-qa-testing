
const request = require("supertest");
const app = require("../index"); // Ensure the correct import
const { validatePAN } = require("../utils/pan_validator.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");

// Mock validatePAN function
jest.mock("../utils/pan_validator.js", () => ({
    validatePAN: jest.fn(),
}));

// ✅ Test validatePANHandler API
describe("PAN Validation API", () => {
    it("should return 400 if PAN is missing", async () => {
        const res = await request(app).post("/validate-pan").send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "PAN is required");
    });

    it("should return 200 with validation result", async () => {
        validatePAN.mockReturnValue(true);
        const res = await request(app)
            .post("/validate-pan")
            .send({ pan: "ABCDE1234F" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Success", isValid: true });
    });
});

// ✅ Test getMutualFundsHandler API
describe("Mutual Funds API", () => {
    it("should return 401 if token is missing", async () => {
        const res = await request(app).get("/mutual-funds");
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("error", "Unauthorized");
    });

    it("should return 200 with mutual funds data", async () => {
        const mockToken = jwt.sign({ email: "test@user.com" }, JWT_SECRET, { expiresIn: "1h" });

        const res = await request(app)
            .get("/mutual-funds")
            .set("Authorization", `Bearer ${mockToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Success");
        expect(res.body).toHaveProperty("data");
    });
});

// ✅ Test handleAuth API
describe("Authentication API", () => {
    it("should return 400 if email or password is missing", async () => {
        const res = await request(app).post("/auth").send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "Email and password are required");
    });

    it("should return 401 for invalid credentials", async () => {
        const res = await request(app).post("/auth").send({
            email: "yash@yenmo.in",
            password: "wrongpassword",
        });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should return 200 and a JWT token for valid credentials", async () => {
        const res = await request(app).post("/auth").send({
            email: "yash@yenmo.in",
            password: "abc123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("auth_token");
    });
});

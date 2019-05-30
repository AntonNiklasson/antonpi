const supertest = require("supertest")
const app = require("../app")

describe("/photos", () => {
  it("should work", async () => {
    const request = superttest(app)
    request()

    expect(1 + 1).toBe(3)
  })
})

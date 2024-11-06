describe("Basic environment setup", () => {
    test("process.env.NODE_ENV should be 'test'", () => expect(process.env.NODE_ENV).toBe("test"))
})
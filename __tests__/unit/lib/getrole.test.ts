import { describe, test, expect } from 'vitest';
import { get_user_role } from '$lib/getrole';

describe("get_user_role", () => {
    test("Should correctly decode jwt token to get role", () => {
        const expected = "Student";
        const input = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN0dWRlbnQiLCJleHAiOjE3MzIwMDg5NTEsImlzcyI6IkJhY2tlbmRlciIsImF1ZCI6IkZyb250ZW5kIn0.lc_W_qOs6WAo6xTtW57Us_FSm1ythQu5FFnMhM0lMYw";
        const result = get_user_role(input);
        expect(result).toEqual(expected);
    });
});

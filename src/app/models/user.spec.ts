import {User} from "./user";

describe('User', () => {
    it('has username', () => {
        let user = new User('testuser');
        expect(user.username).toEqual('testuser');
    });
});

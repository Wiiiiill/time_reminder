import { testApi } from "@/apis/test";

export default {
    getTestData: async () => {
        const res = await testApi({})
        return res
    }
}
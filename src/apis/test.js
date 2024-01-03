import request, { modulePath } from "@/apis/request"
const path = modulePath("", true)
export const testApi = (params) => request.get(`${path}/applications`, { params })
export const getAppliicationRole = () => request.get(`${path}/applicationRole`)
export const getApplications = () => request.get(`${path}/applications`)
export const getRbacInfo = (moduleName) => request.get(`${path}/${moduleName}`)
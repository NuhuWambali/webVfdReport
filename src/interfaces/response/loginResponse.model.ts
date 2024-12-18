export interface loginResponse {
        id:string,
        userName: string,
        fullName: string,
        role: string,
        permissions: [
          string
        ],
        token: string,
        branchId:string,
       
}

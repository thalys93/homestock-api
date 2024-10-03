import { CreateAddressDto } from "src/address/dto/create-address.dto"

export class CreateUserAddressDto {
    nickname: string
    user_id: string    
    address: CreateAddressDto
}

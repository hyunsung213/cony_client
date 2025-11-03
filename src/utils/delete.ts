import apiClient from "./api";
import { PaymentConfirm } from "./interface/payment";

export async function deletePhoto(photoId: number) {
  try {
    const response = await apiClient.delete(`/photos/${photoId}`);
    console.log("사진 삭제 성공: ", response.data);
    return response.data;
  } catch (error) {
    console.log("사진 삭제 실패했습니다!: ", error);
  }
}

export async function deletePayment(gameId: number, userPhoneNum: string) {
  try {
    const response = await apiClient.delete(`/payments/`, {
      data: {
        gameId,
        userPhoneNum,
      },
    });
    console.log("승인 삭제 성공: ", response.data);
    return response.data;
  } catch (error) {
    console.log("승인 삭제 실패했습니다!: ", error);
  }
}

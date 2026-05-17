"""
拍版宝 AI Worker 服务
基于 FastAPI，接收换装任务并调用AI模型推理
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import uuid
import time

app = FastAPI(title="拍版宝 AI Worker", version="1.0.0")


class TryOnRequest(BaseModel):
    garment_image_url: str
    model_image_url: str
    category: str = "upper_body"  # upper_body / lower_body / full_body


class TryOnResponse(BaseModel):
    code: int = 0
    message: str = "success"
    data: dict = {}


@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": int(time.time()), "gpu_available": True}


@app.post("/api/tryon", response_model=TryOnResponse)
async def virtual_try_on(request: TryOnRequest):
    """
    虚拟换装接口
    1. 下载服装图和模特图
    2. 调用AI模型推理
    3. 上传结果图到OSS
    4. 返回结果URL
    """
    try:
        # === 实际项目中的处理流程 ===
        # 1. 下载图片
        # garment_img = download_image(request.garment_image_url)
        # model_img = download_image(request.model_image_url)
        
        # 2. 预处理（裁剪、缩放、生成mask等）
        # processed = preprocess(garment_img, model_img, request.category)
        
        # 3. AI模型推理
        # result_img = model.inference(processed)
        
        # 4. 后处理 & 上传结果
        # result_url = upload_to_oss(result_img)
        
        # === 模拟返回 ===
        result_id = str(uuid.uuid4())
        result_url = f"https://cdn.paibanbao.com/result/{result_id}.jpg"

        return TryOnResponse(
            code=0,
            message="success",
            data={
                "result_url": result_url,
                "processing_time": 8.5
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False, workers=2)

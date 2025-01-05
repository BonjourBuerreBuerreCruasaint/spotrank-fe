document.addEventListener('DOMContentLoaded', function() {
    // 이미지 리사이징 함수 추가
    function resizeImage(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 250;
                canvas.height = 250;
                const ctx = canvas.getContext('2d');
                
                // 이미지를 250x250 크기로 그리기
                ctx.drawImage(img, 0, 0, 250, 250);
                
                // 리사이즈된 이미지 데이터 반환
                callback(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 이미지 미리보기 함수 수정
    function handleImagePreview(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const plusIcon = preview.previousElementSibling;

        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                resizeImage(file, function(resizedImage) {
                    // 미리보기 업데이트
                    preview.src = resizedImage;
                    preview.style.display = 'block';
                    if (plusIcon) plusIcon.style.display = 'none';

                    // localStorage에 저장
                    try {
                        localStorage.setItem(`store_image_${inputId}`, resizedImage);
                    } catch (error) {
                        console.error('이미지 저장 중 오류:', error);
                        alert('이미지 저장 중 오류가 발생했습니다.');
                    }
                });
            }
        });
    }

    // 메인 이미지 미리보기 설정
    handleImagePreview('mainImage', 'mainPreview');

    // 추가 이미지 미리보기 설정
    for (let i = 1; i <= 6; i++) {
        handleImagePreview(`subImage${i}`, `subPreview${i}`);
    }

    // 폼 제출 처리
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 설명 저장
        const description = document.getElementById('description').value;
        localStorage.setItem('storeDescription', description);

        alert('수정이 완료되었습니다.');
        window.location.href = 'index.html';
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const kanjiContainer = document.getElementById("kanji-container");
    const dropZoneLeft = document.getElementById("drop-zone-left");
    const dropZone = document.getElementById("drop-zone");
    const resultText = document.getElementById("result");
    const checkAnswerButton = document.getElementById("check-answer");

    const kanjiList = ["挨", "王", "体", "拶", "媒", "玉"];
    const correctCombinations = ["挨拶", "媒体"];
    const correctLeftRightCombination = { left: "王", right: "玉" };

    let solvedCombinations = 0;

    // 漢字をドラッグ可能にする
    kanjiList.forEach(kanji => {
        const kanjiElement = document.createElement("div");
        kanjiElement.classList.add("kanji-item");
        kanjiElement.textContent = kanji;
        kanjiElement.draggable = true;
        kanjiElement.addEventListener("dragstart", (event) => {
            if (!kanjiElement.classList.contains("disabled")) {
                event.dataTransfer.setData("text", kanji);
            }
        });
        kanjiContainer.appendChild(kanjiElement);
    });

    function setupDropZone(dropZoneElement) {
        dropZoneElement.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        dropZoneElement.addEventListener("drop", (event) => {
            event.preventDefault();
            const kanji = event.dataTransfer.getData("text");

            if (!kanjiList.includes(kanji)) {
                return;
            }

            if (!dropZoneElement.textContent.includes(kanji)) {
                dropZoneElement.textContent += kanji;

                const elements = document.querySelectorAll(".kanji-item");
                elements.forEach(element => {
                    if (element.textContent === kanji) {
                        element.classList.add("disabled");
                    }
                });
            }
        });
    }

    // 「判定」ボタンを押したときに正誤判定
    checkAnswerButton.addEventListener("click", () => {
        resultText.textContent = "";
        let isCorrect = false; // 毎回 false にリセット

        setTimeout(() => {
            // 既存の正誤判定（dropZone に入った文字をすべてチェック）
            if (correctCombinations.includes(dropZone.textContent)) {
                solvedCombinations++;
                resultText.textContent = "正解です。";
                dropZone.textContent = "";
                isCorrect = true;
            }

            // 新しい正誤判定（左「四」+ 右「国」）
            if (dropZoneLeft.textContent === correctLeftRightCombination.left && dropZone.textContent === correctLeftRightCombination.right) {
                solvedCombinations++;
                resultText.textContent = "正解です。";
                dropZoneLeft.textContent = "";
                dropZone.textContent = "";
                isCorrect = true;
            }

            // **不正解の処理**
            if (!isCorrect) {
                resultText.textContent = "不正解です。";
                setTimeout(() => {
                    resetGame();
                }, 1000); // 1秒間「不正解」メッセージを表示
            }

            // **全問正解のメッセージ**
            if (solvedCombinations === correctCombinations.length + 1) {
                resultText.innerHTML = "全問正解です！おめでとうございます！";
            }
        }, 500); // 0.5秒の遅延を入れて、確実に処理する
    });

    setupDropZone(dropZone);
    setupDropZone(dropZoneLeft);

    function resetGame() {
        dropZone.textContent = "";
        dropZoneLeft.textContent = "";
        solvedCombinations = 0;

        const elements = document.querySelectorAll(".kanji-item");
        elements.forEach(element => {
            element.classList.remove("disabled");
        });

        resultText.textContent = "";
    }

    document.getElementById("reset").addEventListener("click", () => {
        resetGame();
    });
});

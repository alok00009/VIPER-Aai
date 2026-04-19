  function loadHistory() {
    const listDiv = document.getElementById('historyList');
    onValue(ref(db, `user_history/${userKey}`), async (snapshot) => {
        const realData = await getRealResults();
        if (!snapshot.exists()) {
            listDiv.innerHTML = "<p class='text-center py-10 text-gray-800 text-[9px] font-black'>No Records Found 💀</p>";
            return;
        }

        listDiv.innerHTML = "";
        const data = snapshot.val();
        
        Object.values(data).reverse().forEach(item => {
            // Precise 6-digit matching
            const match = realData.find(r => 
                String(r.issueNumber).slice(-6) === String(item.period).slice(-6)
            );

            let status = "JK (PENDING)", 
                border = "border-gray-800", 
                sCol = "text-gray-500",
                displayResult = "---";

            if (match) {
                const realNum = parseInt(match.number);
                const realSize = realNum >= 5 ? "BIG" : "SMALL";
                
                if (item.prediction === realSize) {
                    status = `WIN (${realSize})`; 
                    border = "border-emerald-500/30"; 
                    sCol = "text-emerald-500";
                } else {
                    status = `LOSS (${realSize} ${realNum})`; 
                    border = "border-red-500/30"; 
                    sCol = "text-red-500";
                }
                displayResult = `${realSize} (${realNum})`;
            }

            listDiv.innerHTML += `
                <div class="history-card p-4 border ${border} flex justify-between items-center mb-2 bg-black/20">
                    <div class="space-y-1">
                        <p class="text-[7px] text-gray-600 font-bold">PERIOD: ...${item.period.toString().slice(-4)}</p>
                        <div class="flex items-center gap-2">
                            <span class="text-[9px] px-2 py-0.5 bg-white/5 rounded text-white/40">PRED: ${item.prediction}</span>
                            <span class="text-[9px] px-2 py-0.5 bg-white/5 rounded text-white font-bold">REAL: ${displayResult}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="hacker-font text-[10px] ${sCol} italic font-black tracking-tighter">${status}</p>
                        <p class="text-[6px] text-white/10 font-bold mt-1">${item.time}</p>
                    </div>
                </div>
            `;
        });
    });
  }

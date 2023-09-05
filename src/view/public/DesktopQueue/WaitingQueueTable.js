import React, { useState, useEffect } from "react";
import "../../../style/desktop.css";
import axios from "axios";
import { format, isSameDay } from "date-fns";
import { parse } from "date-fns";
function WaitingQueueTable() {
   
    const queueList = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        patientName: `Patient ${index + 1}`,
        queueNumber: index + 1,
    }));
   
    return (
        <div className="waiting-queue-table">
            <h2>รอเรียกคิว</h2>
            <table class="tables">
              <thead class="theads">
                    <tr>
                        <th>คิวที่</th>
                        <th>ชื่อผู้ป่วย</th>
                    </tr>
                </thead>
                <tbody>
                    {queueList.map((queue) => (
                        <tr key={queue.id}>
                            <td>{queue.queueNumber}</td>
                            <td>{queue.patientName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default WaitingQueueTable;

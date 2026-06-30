import React from 'react'
const CabFormVerify = ({ payData, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">Confirm Submission</h2>
                <div className="text-left mb-4">
                    <p>Registration: <strong> {payData.registrationNumber} </strong> </p>
                    <p>Cab Type: <strong>{payData.carType}</strong> </p>
                    <p>Cab Service type: <strong>{payData.cabServiceType}</strong> </p>
                    <p>Cab Model: <strong>{payData.carModel}</strong> </p>
                    <p>Fuel Type: <strong> {payData.fuelType}</strong></p>
                    <p>Carrier: <strong>{payData.carrier}</strong> </p>
                    {/* <p><strong>Cap Model:</strong> {payData.cap_model}</p> */}

                </div>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to submit the cab details?
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onCancel}
                        className="bg-gray-200 text-gray-700 px-8 py-2 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Yes, Submit
                    </button>
                </div>
            </div>
        </div>
    )
}
export default CabFormVerify
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import useAuthStore from "@/store/authStore";

export default function ViewLogFile() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                if (!token) {
                    setError("Unauthorized: Token not found");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://localhost:8000/api/logs", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setLogs(response.data.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : "Failed to fetch logs");
                console.error("Error fetching logs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [token]);

    const handleDelete = async (logId) => {
        try {
            if (!token) {
                setError("Unauthorized: Token not found");
                return;
            }

            const response = await axios.delete(`http://localhost:8000/api/logs/${logId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));
                alert('Log deleted successfully!');
            } else {
                setError("Failed to delete the log.");
            }
        } catch (err) {
            setError("Failed to delete the log.");
            console.error("Error deleting log:", err);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>View recent system logs and activities.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p>Loading logs...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : logs.length > 0 ? (
                    <div>
                        {logs.map(({ id, created_at, action, description }) => (
                            <div key={id} className="flex items-center mb-4">
                                <pre className="bg-gray-100 p-4 rounded-md text-sm flex-1">
                                    {`${new Date(created_at).toLocaleString()} [${action.toUpperCase()}] ${description}`}
                                </pre>
                                <button
                                    className="ml-4 text-red-500 hover:text-red-700"
                                    onClick={() => handleDelete(id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No logs available</p>
                )}
            </CardContent>
        </Card>
    );
}

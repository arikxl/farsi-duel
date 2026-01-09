export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8">
      <h1 className="text-4xl font-black text-blue-600">עתידים בו&quot;מ</h1>
      <h2 className="text-2xl font-bold">ראש בראש</h2>

      <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 w-full">
        <p className="text-lg">באר שבע ⚔️ אילת</p>
      </div>

      <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg hover:bg-blue-700 transition-all w-full">
        התחל משחק
      </button>
    </div>
  );
}
export function LogsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold leading-tight">
          Log Aktivitas
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Riwayat aktivitas sistem, login, perubahan data, dan lainnya.
        </p>
      </div>
    </div>
  );
}

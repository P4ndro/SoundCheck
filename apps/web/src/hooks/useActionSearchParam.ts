import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useSearchParams } from "react-router-dom";

export function useActionSearchParam(
  param: string,
  setOpen: Dispatch<SetStateAction<boolean>>,
) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get(param) !== "1") return;
    setOpen(true);
    setSearchParams({}, { replace: true });
  }, [param, searchParams, setSearchParams, setOpen]);
}

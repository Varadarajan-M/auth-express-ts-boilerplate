class Utils {
	static stringEmpty = (s: string) => !!s?.length;

	static exists = <T>(v: T) => v !== null && v !== undefined;

	static hasLength = (v: string, len: number) => v.length >= len;
}

export default Utils;

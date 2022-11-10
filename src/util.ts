class Utils {
	static stringEmpty = (s: string) => !!s?.length;

	static exists = <T>(v: T) => v !== null && v !== undefined;

	static hasLength = (v: string, len: number) => v.length >= len;

	static isProduction = () => process.env.NODE_ENV === 'production';
}

export default Utils;

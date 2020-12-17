package paymentserver;

public final class Result<T>
{
	private boolean success;
	private T value;

	public Result()
	{
	}

	private Result(boolean success, T value)
	{
		this.success = success;
		this.value = value;
	}
	public boolean Success()
	{
		return success;
	}
	public T getValue()
	{
		return value;
	}
	public static <T> Result<T> Success(T value)
	{
		return new Result<T>(true, value);
	}
	public static <T> Result<T> Failure(T value)
	{
		return new Result<T>(false, value);
	}

	public Result clone()
	{
		Result varCopy = new Result();

		varCopy.success = this.success;
		varCopy.value = this.value;

		return varCopy;
	}
}
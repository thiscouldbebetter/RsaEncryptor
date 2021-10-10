
class MathHelperLargeInteger
{
	static areCoprime(a, b)
	{
		var greatestCommonDivisor =
			MathHelperLargeInteger.greatestCommonDivisor(a, b);
		var one = new LargeInteger(a.base).setToOne();
		var returnValue = greatestCommonDivisor.isEqualTo(one);
		return returnValue;
	}
 
	static greatestCommonDivisor(a, b)
	{
		// Adapted from pseudocode at the URL:
		// https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm

		var base = a.base;

		var s = new LargeInteger(base).setToZero();
		var old_s = new LargeInteger(base).setToOne();

		var t = new LargeInteger(base).setToOne();
		var old_t = new LargeInteger(base).setToZero();

		var r = b.clone();
		var old_r = a.clone();

		var quotient = new LargeInteger(base);
		var temp = new LargeInteger(base);
		var temp2 = new LargeInteger(base);
		var zero = new LargeInteger(base).setToZero();

		while (r.isNotEqualTo(zero))
		{
			quotient.overwriteWith(old_r).divide(r);
			 
			temp.overwriteWith(r);
			r.overwriteWith(old_r).subtract
			(
				temp2.overwriteWith(quotient).multiply(temp)
			);
			old_r.overwriteWith(temp);
			 
			temp.overwriteWith(s);
			s.overwriteWith(old_s).subtract
			(
				temp2.overwriteWith(quotient).multiply(temp)
			);
			old_s.overwriteWith(temp);
			 
			temp.overwriteWith(t);
			t.overwriteWith(old_t).subtract
			(
				temp2.overwriteWith(quotient).multiply(temp)
			);
			old_t.overwriteWith(temp);
		}

		var returnValue = old_r;

		return returnValue;
	}
 
	static isPrime(possiblePrime, two, zero, temp)
	{
		// hack - This is almost certainly not the most efficient algorithm.

		var returnValue = true;

		if (two == null)
		{
			var base = possiblePrime.base;
			two = new LargeInteger(base).setFromInt(2);
			zero = new LargeInteger(base).setToZero();
			temp = new LargeInteger(base);
		}

		if (possiblePrime.isLessThan(two))
		{
			returnValue = false;
		}
		else
		{
			// hack - A lot of re-instancing here.
			var possiblePrimeHalf =
				possiblePrime.clone().divide(two);
			var factorCurrent = two.clone();
			 
			while (factorCurrent.isLessThanOrEqualTo(possiblePrimeHalf))
			{
				while
				(
					MathHelperLargeInteger.isPrime
					(
						factorCurrent, two, zero, temp
					) == false
				)
				{
					factorCurrent.increment();
				}

				var isPossiblePrimeAMultipleOfCurrentDivisor =
					temp.overwriteWith
					(
						possiblePrime
					).modulo
					(
						factorCurrent
					).isEqualTo
					(
						zero
					);

				if (isPossiblePrimeAMultipleOfCurrentDivisor)
				{
					returnValue = false;
					break;
				}

				factorCurrent.increment();
			}
		}

		return returnValue;
	}

	static leastCommonMultiple(a, b)
	{
		var product = a.clone().multiply(b);
		var greatestCommonDivisor =
			MathHelperLargeInteger.greatestCommonDivisor(a, b);
		var returnValue = product.divide(greatestCommonDivisor);
		return returnValue;
	}
 
	static modularMultiplicativeInverse(valueToInvert, modulus)
	{
		// Adapted from:
		// https://math.stackexchange.com/questions/67171/
		// calculating-the-modular-multiplicative-inverse-without-all-those-strange-looking

		var returnValue;

		var base = valueToInvert.base;

		var one = new LargeInteger(base).setToOne();

		if (valueToInvert.isEqualTo(one))
		{
			returnValue = one.clone();
		}
		else
		{
			var temp = new LargeInteger(base);
			var temp2 = new LargeInteger(base);

			var c = modulus.clone().modulo(valueToInvert);
			var d = valueToInvert.clone();
			var u = modulus.clone().divide(valueToInvert);
			var v = one.clone();

			while
			(
				c.isNotEqualTo(one)
				&& d.isNotEqualTo(one)
			)
			{
				v.add
				(
					temp.overwriteWith
					(
						d
					).divide
					(
						c
					).multiply
					(
						u
					)
				);

				d.modulo(c);

				if (d.isNotEqualTo(one))
				{
					u.add
					(
						temp.overwriteWith
						(
							c
						).divide
						(
							d
						).multiply
						(
							v
						)
					);

					c.modulo(d);
				}
			}

			var tAsInt = (d.isNotEqualTo(one) ? 1 : 0);
			var t = new LargeInteger(base).setFromInt(tAsInt);

			returnValue = v.multiply
			(
				temp.overwriteWith
				(
					one
				).subtract
				(
					t
				)
			).add
			(
				temp.overwriteWith(t).multiply
				(
					temp2.overwriteWith
					(
						modulus
					).subtract
					(
						u
					)
				)
			);
		}
		 
		return returnValue;
	}

}

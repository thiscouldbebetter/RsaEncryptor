
class EncryptionKeyPair
{
	constructor(modulus, publicExponent, privateExponent)
	{
		this.modulus = modulus;
		this.publicExponent = publicExponent;
		this.privateExponent = privateExponent;
	}

	decrypt(messageToDecrypt)
	{
		return this.encryptOrDecrypt
		(
			messageToDecrypt, this.publicExponent
		);
	}

	encrypt(messageToEncrypt)
	{
		return this.encryptOrDecrypt
		(
			messageToEncrypt, this.privateExponent
		);
	}

	encryptOrDecrypt(message, exponent)
	{
		var result = message.raiseToPower
		(
			exponent
		).modulo
		(
			this.modulus
		);

		return message;
	}

	generate(digitsPerPrime)
	{
		// Adapted from an example found at the URL
		// https://en.wikipedia.org/wiki/RSA_(cryptosystem)
 
		var primesRandom = [];
		var base = 10;
		var valueMaxForNumberOfDigits =
			new LargeInteger(base).setFromInt(base).raiseToPower
			(
				new LargeInteger(base).setFromInt(digitsPerPrime)
			);

		var numberOfPrimesToChoose = 2;

		for (var i = 0; i < numberOfPrimesToChoose; i++)
		{
			var primeCandidate =
				valueMaxForNumberOfDigits.clone().randomize();

			while (MathHelperLargeInteger.isPrime(primeCandidate) == false)
			{
				primeCandidate.increment();
			}

			primesRandom.push(primeCandidate);
		}

		var prime0 = primesRandom[0];
		var prime1 = primesRandom[1];

		var modulus = prime0.clone().multiply(prime1);

		var totient = MathHelperLargeInteger.leastCommonMultiple
		(
			prime0.clone().decrement(),
			prime1.clone().decrement()
		);

		var publicExponentCandidate = totient.clone().randomize();

		var areCoprime = MathHelperLargeInteger.areCoprime;

		while (areCoprime(publicExponentCandidate, totient) == false)
		{
			publicExponentCandidate.increment();
			if (publicExponentCandidate.isGreaterThanOrEqualTo(totient))
			{
				publicExponentCandidate.setFromInt(2);
			}
		}

		var publicExponent = publicExponentCandidate;

		var privateExponent = MathHelperLargeInteger.modularMultiplicativeInverse
		(
			publicExponent,
			totient
		);

		this.modulus = modulus;
		this.publicExponent = publicExponent;
		this.privateExponent = privateExponent;

		return this;
	}

	// string

	toString()
	{
		var objectToSerialize =
		{
			"modulus" : this.modulus.toString(),
			"publicExponent" : this.publicExponent.toString(),
			"privateExponent" : this.privateExponent.toString()
		}
		var returnValue = JSON.stringify(objectToSerialize);
		return returnValue;
	}
}
